import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { setTimeout as sleep } from 'node:timers/promises'

const PORT = 9334
const OUT = '.check-shots'
mkdirSync(OUT, { recursive: true })

const chrome = spawn(
  'google-chrome',
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=/tmp/verify-check-profile',
    'about:blank',
  ],
  { stdio: 'ignore' },
)

let wsUrl
for (let i = 0; i < 50; i++) {
  try {
    const res = await fetch(`http://127.0.0.1:${PORT}/json/list`)
    const targets = await res.json()
    const page = targets.find((t) => t.type === 'page')
    if (page?.webSocketDebuggerUrl) {
      wsUrl = page.webSocketDebuggerUrl
      break
    }
  } catch {}
  await sleep(200)
}
if (!wsUrl) throw new Error('chrome did not start')

const ws = new WebSocket(wsUrl)
await new Promise((resolve, reject) => {
  ws.onopen = resolve
  ws.onerror = reject
})

let id = 0
const pending = new Map()
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data)
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id)
    pending.delete(msg.id)
    msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result)
  }
}
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const msgId = ++id
    pending.set(msgId, { resolve, reject })
    ws.send(JSON.stringify({ id: msgId, method, params }))
  })

const evaluate = async (expression) => {
  const { result } = await send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  })
  return result.value
}

const clickText = (text) =>
  evaluate(`(() => {
    const candidates = [...document.querySelectorAll('body *')]
      .filter((el) => el.children.length === 0 && el.textContent.trim() === ${JSON.stringify(text)})
    const el = candidates[0] ?? [...document.querySelectorAll('button, a')]
      .find((b) => b.textContent.includes(${JSON.stringify(text)}))
    if (!el) return 'NOT_FOUND'
    el.click()
    return 'CLICKED'
  })()`)

const shot = async (name) => {
  const { data } = await send('Page.captureScreenshot', { format: 'png' })
  writeFileSync(`${OUT}/${name}.png`, Buffer.from(data, 'base64'))
}

await send('Page.enable')
await send('Runtime.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: 'http://localhost:5199/setup' })
await sleep(2000)
// walk through setup so teams exist, then jump straight to the game
console.log(
  'next buttons:',
  JSON.stringify(
    await evaluate(`[...document.querySelectorAll('button')].map((b) => b.textContent.trim()).filter((t) => t.includes('التالي'))`),
  ),
)
console.log('setup next1:', await clickText('التالي'))
await sleep(600)
console.log('heading after next1:', JSON.stringify(await evaluate(`document.querySelector('h2')?.textContent`)))
console.log('setup next2:', await clickText('التالي'))
await sleep(600)
console.log('setup ready:', await clickText('جاهزون؟'))
await sleep(500)
console.log('setup start:', await clickText('بدء المباراة'))
await sleep(4200)

console.log('url after start:', await evaluate('location.pathname'))
console.log('open game:', await clickText('تحدي الحرف التالي'))
await sleep(1800)
console.log('url after open:', await evaluate('location.pathname'))

await shot('1-picker')
console.log('pick set:', await clickText('القسم والمدرسة'))
await sleep(900)
await shot('2-question')

console.log(
  'check button before selection:',
  JSON.stringify(
    await evaluate(`(() => {
      const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.includes('تحقق'))
      return btn ? { disabled: btn.disabled, opacity: getComputedStyle(btn).opacity } : 'NOT_FOUND'
    })()`),
  ),
)

console.log(
  'option click:',
  await evaluate(`(() => {
    const options = [...document.querySelectorAll('button.kid-choice')]
    if (!options.length) return 'NO_OPTIONS ' + document.querySelectorAll('button').length
    options[0].click()
    return 'CLICKED ' + options.length
  })()`),
)
await sleep(400)

console.log(
  'check button after selection:',
  JSON.stringify(
    await evaluate(`(() => {
      const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.includes('تحقق'))
      return btn ? { disabled: btn.disabled, opacity: getComputedStyle(btn).opacity } : 'NOT_FOUND'
    })()`),
  ),
)

await shot('3-selected')
console.log('click check:', await clickText('تحقق'))
await sleep(900)
await shot('4-after-check')
console.log(
  'body feedback:',
  await evaluate(`document.body.innerText.includes('جيد') || document.body.innerText.includes('حاول')`),
)

ws.close()
chrome.kill()
