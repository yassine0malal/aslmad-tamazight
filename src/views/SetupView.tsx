import { useGame } from '@/context/GameContext'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router'
import {
  Users,
  Play,
  Sparkles,
  Star,
  Minus,
  Plus,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Pencil,
} from 'lucide-react'
import { routes } from '@/lib/routes'
import { colorOptions, createTeamConfig } from '@/data/constants'
import defaultImage from '../assets/default.png'

const STEPS = [
  { title: 'كم فريق؟', icon: Users },
  { title: 'جهّز الفرق', icon: Pencil },
  { title: 'المجموعات', icon: Star },
]

const QUESTIONS_PER_GROUP = 3

/* All animations live here so no extra setup/CSS file is needed. */
const css = `
/* Soft glows over the site canvas — the edges fade into the page, so there is
   no hard rectangle between the setup screen and the rest of the app. */
.sv-root { font-family: inherit; background:
  radial-gradient(1100px 720px at 8% -6%, rgba(255, 206, 122, 0.55) 0%, rgba(255, 206, 122, 0) 62%),
  radial-gradient(960px 680px at 96% 4%, rgba(255, 174, 206, 0.48) 0%, rgba(255, 174, 206, 0) 60%),
  radial-gradient(1000px 720px at 50% 112%, rgba(150, 216, 255, 0.42) 0%, rgba(150, 216, 255, 0) 62%),
  linear-gradient(128deg, #fff9ee 0%, #fff0f3 34%, #f7efff 62%, #eef8ff 100%); }
.sv-shell { min-height: calc(100dvh - 96px); border-radius: 34px; border: 3px solid rgba(255,255,255,.85); box-shadow: 0 0 0 1px rgba(184,164,237,.16), 0 18px 45px rgba(61,44,20,.06); }
@media (max-width: 1023px) { .sv-shell { min-height: calc(100dvh - 90px); border-radius: 26px; } }
@media (max-width: 640px) { .sv-shell { min-height: auto; border-radius: 22px; border-width: 2px; box-shadow: 0 0 0 1px rgba(184,164,237,.14), 0 10px 26px rgba(61,44,20,.06); } }
.sv-letter { position:absolute; font-family:'El Messiri', serif; color:#7c6cf0; opacity:.07; pointer-events:none; user-select:none; animation: sv-float 9s ease-in-out infinite; }
.sv-blob { position:absolute; border-radius:9999px; opacity:.28; filter:blur(26px); animation: sv-float 9s ease-in-out infinite; pointer-events:none; }
@keyframes sv-float { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-22px) rotate(8deg)} }

/* Slide between steps. "next" enters from the LEFT, "back" enters from the RIGHT. */
.sv-slide-next { animation: sv-in-left .5s cubic-bezier(.22,1,.36,1) both; }
.sv-slide-back { animation: sv-in-right .5s cubic-bezier(.22,1,.36,1) both; }
@keyframes sv-in-left  { from{opacity:0; transform:translateX(-80px)} to{opacity:1; transform:translateX(0)} }
@keyframes sv-in-right { from{opacity:0; transform:translateX(80px)}  to{opacity:1; transform:translateX(0)} }

.sv-pop { animation: sv-pop .45s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes sv-pop { from{opacity:0; transform:scale(.6)} to{opacity:1; transform:scale(1)} }
.sv-fade { animation: sv-fade .25s ease both; }
@keyframes sv-fade { from{opacity:0} to{opacity:1} }
.sv-drop { animation: sv-drop .4s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes sv-drop { from{opacity:0; transform:translateY(-40px)} to{opacity:1; transform:translateY(0)} }
.sv-shake { animation: sv-shake .4s ease; }
@keyframes sv-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
.sv-wiggle:hover { animation: sv-wiggle .5s ease; }
@keyframes sv-wiggle { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-4deg)} 75%{transform:rotate(4deg)} }
.sv-bounce { animation: sv-bounce 1.6s ease-in-out infinite; }
@keyframes sv-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
.sv-count { animation: sv-count 1s ease both; }
@keyframes sv-count { 0%{opacity:0; transform:scale(.3)} 30%{opacity:1; transform:scale(1.15)} 80%{opacity:1; transform:scale(1)} 100%{opacity:0; transform:scale(1.6)} }

.sv-btn { transition: transform .15s ease, box-shadow .15s ease; cursor:pointer; border:0; font-weight:800; }
.sv-btn:hover:not(:disabled) { transform: translateY(-3px) scale(1.03); }
.sv-btn:active:not(:disabled) { transform: translateY(2px) scale(.97); }
.sv-btn:disabled { opacity:.45; cursor:not-allowed; }
.sv-card { background:#fff; border-radius:28px; box-shadow:0 8px 0 rgba(0,0,0,.07), 0 18px 40px rgba(0,0,0,.08); }
.sv-input { width:100%; padding:14px 18px; border-radius:18px; border:3px solid #e6e6f0; font-size:1.15rem; font-weight:700; outline:none; transition:border-color .2s, box-shadow .2s; background:#fafaff; }
.sv-input:focus { border-color:#ff8a5c; box-shadow:0 0 0 5px rgba(255,138,92,.2); }
input[type=range].sv-range { -webkit-appearance:none; appearance:none; height:14px; border-radius:9999px; background:#e9e4f5; outline:none; }
input[type=range].sv-range::-webkit-slider-thumb { -webkit-appearance:none; width:34px; height:34px; border-radius:9999px; background:currentColor; border:5px solid #fff; box-shadow:0 3px 8px rgba(0,0,0,.25); cursor:pointer; }
input[type=range].sv-range::-moz-range-thumb { width:26px; height:26px; border-radius:9999px; background:currentColor; border:5px solid #fff; box-shadow:0 3px 8px rgba(0,0,0,.25); cursor:pointer; }
@media (prefers-reduced-motion: reduce) { .sv-root *, .sv-root *::before { animation-duration:.01ms !important; transition-duration:.01ms !important; } }
`

type TeamConfig = ReturnType<typeof createTeamConfig>

const Avatar = ({ team, size = 64 }: { team: TeamConfig; size?: number }) => (
  <div
    className="flex items-center justify-center shrink-0"
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: `${team.color}22`,
      border: `4px solid ${team.color}`,
    }}
  >
    <img
      src={team.avatar || defaultImage}
      alt={team.name}
      style={{ width: size * 0.68, height: size * 0.68 }}
      className="object-contain"
    />
  </div>
)

const RoundBtn = ({
  onClick,
  children,
  color,
  disabled,
}: {
  onClick: () => void
  children: React.ReactNode
  color: string
  disabled?: boolean
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="sv-btn flex items-center justify-center"
    style={{
      width: 'clamp(46px, 11vw, 60px)',
      height: 'clamp(46px, 11vw, 60px)',
      borderRadius: '50%',
      background: color,
      color: '#fff',
      boxShadow: `0 6px 0 ${color}99`,
    }}
  >
    {children}
  </button>
)

export default function SetupView() {
  const { state, dispatch } = useGame()
  const navigate = useNavigate()
  const hasExistingTeams = state.teams.length > 0

  const [teamCount, setTeamCount] = useState(
    hasExistingTeams ? state.teams.length : 3,
  )
  const [teams, setTeams] = useState<TeamConfig[]>(() => {
    if (hasExistingTeams) {
      return state.teams.map((t) => ({
        name: t.name,
        color: t.color,
        avatar: t.avatar,
      })) as TeamConfig[]
    }
    return Array.from({ length: 3 }, (_, index) => createTeamConfig(index))
  })
  const [groupCount, setGroupCount] = useState(
    hasExistingTeams ? state.groupCount : 3,
  )

  const [step, setStep] = useState(0)
  const [dir, setDir] = useState<'next' | 'back'>('next')
  const [editing, setEditing] = useState<number | null>(null) // team popup
  const [showConfirm, setShowConfirm] = useState(false) // summary popup
  const [countdown, setCountdown] = useState<number | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [shakeKey, setShakeKey] = useState(0)

  /* ---------- helpers ---------- */
  const updateTeam = (index: number, changes: Partial<TeamConfig>) =>
    setTeams((cur) =>
      cur.map((t, i) => (i === index ? { ...t, ...changes } : t)),
    )

  const handleTeamCountChange = (value: number) => {
    const nextCount = Math.max(2, Math.min(8, value))
    setTeamCount(nextCount)
    setTeams((cur) => {
      if (nextCount === cur.length) return cur
      if (nextCount > cur.length) {
        return [
          ...cur,
          ...Array.from({ length: nextCount - cur.length }, (_, i) =>
            createTeamConfig(cur.length + i),
          ),
        ]
      }
      return cur.slice(0, nextCount)
    })
  }

  const handleGroupChange = (value: number) =>
    setGroupCount(Math.max(1, Math.min(34, value || 1)))

  const showToast = (msg: string) => {
    setToast(msg)
    setShakeKey((k) => k + 1)
    setTimeout(() => setToast(null), 2200)
  }

  const namesOk = teams.every((t) => t.name.trim().length > 0)

  const goNext = () => {
    if (step === 1 && !namesOk) {
      showToast('اكتب اسماً لكل فريق أولاً ✏️')
      return
    }
    if (step === STEPS.length - 1) {
      setShowConfirm(true)
      return
    }
    setDir('next')
    setStep((s) => s + 1)
  }

  const goBack = () => {
    if (step === 0) return
    setDir('back')
    setStep((s) => s - 1)
  }

  /* ---------- start: 3-2-1 countdown, then go ---------- */
  const startGame = () => {
    setShowConfirm(false)
    setCountdown(3)
  }

  useEffect(() => {
    if (countdown === null) return
    if (countdown === 0) {
      dispatch({ type: 'START_GAME', payload: { teams, groupCount } })
      const params = new URLSearchParams(window.location.search)
      navigate(params.get('redirect') || routes.gameHub)
      return
    }
    const t = setTimeout(() => setCountdown((c) => (c === null ? c : c - 1)), 1000)
    return () => clearTimeout(t)
  }, [countdown, dispatch, groupCount, navigate, teams])

  /* ---------- UI pieces ---------- */
  const Stepper = (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6">
      {STEPS.map((s, i) => {
        const Icon = s.icon
        const done = i < step
        const active = i === step
        return (
          <div key={s.title} className="flex items-center gap-2 sm:gap-4">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex items-center justify-center transition-all duration-500 ${active ? 'sv-bounce' : ''}`}
                style={{
                  width: active ? 58 : 48,
                  height: active ? 58 : 48,
                  borderRadius: '50%',
                  background: done ? '#4cd18a' : active ? '#ff8a5c' : '#fff',
                  color: done || active ? '#fff' : '#b5b0c9',
                  boxShadow: active
                    ? '0 6px 0 #e0683a'
                    : '0 4px 0 rgba(0,0,0,.08)',
                }}
              >
                {done ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
              </div>
              <span
                className="text-xs sm:text-sm font-bold"
                style={{ color: active ? '#e0683a' : '#8d88a6' }}
              >
                {s.title}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="h-1.5 w-8 sm:w-16 rounded-full transition-all duration-500"
                style={{ background: i < step ? '#4cd18a' : '#e3deef' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )

  /* ---------- steps ---------- */
  const stepTeamCount = (
    <div className="sv-card p-6 sm:p-10 text-center">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-1" style={{ color: '#3b2f63' }}>
        كم فريقاً سيلعب؟ 🎉
      </h2>
      <p className="mb-6 font-semibold" style={{ color: '#8d88a6' }}>
        اختر من 2 إلى 8 فرق، وسيلعبون بالتناوب
      </p>

      <div className="flex items-center justify-center gap-3 sm:gap-5 mb-6">
        <RoundBtn
          color="#7c6cf0"
          disabled={teamCount <= 2}
          onClick={() => handleTeamCountChange(teamCount - 1)}
        >
          <Minus className="w-8 h-8" />
        </RoundBtn>
        <div
          key={teamCount}
          className="sv-pop flex items-center justify-center font-extrabold"
          style={{
            width: 'clamp(84px, 24vw, 120px)',
            height: 'clamp(84px, 24vw, 120px)',
            borderRadius: 'clamp(24px, 7vw, 36px)',
            background: 'linear-gradient(135deg,#ffb36b,#ff7a59)',
            color: '#fff',
            fontSize: 'clamp(2.4rem, 9vw, 4rem)',
            boxShadow: '0 8px 0 #e0683a',
          }}
        >
          {teamCount}
        </div>
        <RoundBtn
          color="#7c6cf0"
          disabled={teamCount >= 8}
          onClick={() => handleTeamCountChange(teamCount + 1)}
        >
          <Plus className="w-8 h-8" />
        </RoundBtn>
      </div>

      <input
        type="range"
        min={2}
        max={8}
        value={teamCount}
        onChange={(e) => handleTeamCountChange(Number(e.target.value))}
        className="sv-range w-full max-w-md mb-8"
        style={{ color: '#ff8a5c' }}
      />

      <div className="flex flex-wrap justify-center gap-3 min-h-[72px]">
        {teams.map((t, i) => (
          <div key={i} className="sv-pop" style={{ animationDelay: `${i * 50}ms` }}>
            <Avatar team={t} size={64} />
          </div>
        ))}
      </div>
    </div>
  )

  const stepTeams = (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ color: '#3b2f63' }}>
          اختر اسم ولون كل فريق 🎨
        </h2>
        <p className="font-semibold" style={{ color: '#8d88a6' }}>
          اضغط على أي فريق لتعديله
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {teams.map((team, index) => {
          const empty = team.name.trim().length === 0
          return (
            <button
              key={index}
              onClick={() => setEditing(index)}
              className="sv-card sv-wiggle sv-pop text-start p-5 flex items-center gap-4 cursor-pointer"
              style={{
                animationDelay: `${index * 70}ms`,
                border: `4px solid ${empty ? '#ffd0c2' : team.color}`,
                font: 'inherit',
              }}
            >
              <Avatar team={team} size={72} />
              <div className="min-w-0 flex-1">
                <span className="block text-sm font-bold" style={{ color: '#8d88a6' }}>
                  الفريق {index + 1}
                </span>
                <div
                  className="font-extrabold text-xl truncate"
                  style={{ color: empty ? '#c9c4dc' : '#3b2f63' }}
                >
                  {team.name || 'فريق جديد'}
                </div>
              </div>
              <div
                className="flex items-center justify-center"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 14,
                  background: team.color,
                  color: '#fff',
                }}
              >
                <Pencil className="w-5 h-5" />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )

  const stepGroups = (
    <div className="sv-card p-6 sm:p-10 text-center">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-1" style={{ color: '#3b2f63' }}>
        كم مجموعة في كل شوط؟ 🧩
      </h2>
      <p className="mb-6 font-semibold" style={{ color: '#8d88a6' }}>
        كل مجموعة فيها {QUESTIONS_PER_GROUP} أسئلة • حتى 34 مجموعة
      </p>

      <div className="flex items-center justify-center gap-3 sm:gap-5 mb-6">
        <RoundBtn
          color="#2bb3a3"
          disabled={groupCount <= 1}
          onClick={() => handleGroupChange(groupCount - 1)}
        >
          <Minus className="w-8 h-8" />
        </RoundBtn>
        <div
          key={groupCount}
          className="sv-pop flex items-center justify-center font-extrabold"
          style={{
            width: 'clamp(84px, 24vw, 120px)',
            height: 'clamp(84px, 24vw, 120px)',
            borderRadius: 'clamp(24px, 7vw, 36px)',
            background: 'linear-gradient(135deg,#5ee0c8,#2bb3a3)',
            color: '#fff',
            fontSize: 'clamp(2.4rem, 9vw, 4rem)',
            boxShadow: '0 8px 0 #1f8a7d',
          }}
        >
          {groupCount}
        </div>
        <RoundBtn
          color="#2bb3a3"
          disabled={groupCount >= 34}
          onClick={() => handleGroupChange(groupCount + 1)}
        >
          <Plus className="w-8 h-8" />
        </RoundBtn>
      </div>

      <input
        type="range"
        min={1}
        max={34}
        value={groupCount}
        onChange={(e) => handleGroupChange(Number(e.target.value))}
        className="sv-range w-full max-w-md mb-6"
        style={{ color: '#2bb3a3' }}
      />

      <div
        className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-extrabold"
        style={{ background: '#fff4d6', color: '#b97700' }}
      >
        <Sparkles className="w-5 h-5" />
        المجموع: {groupCount * QUESTIONS_PER_GROUP} سؤال!
      </div>
    </div>
  )

  const steps = [stepTeamCount, stepTeams, stepGroups]

  /* ---------- render ---------- */
  return (
    <div
      dir="rtl"
      className="sv-root sv-shell relative w-full overflow-hidden px-3 py-4 sm:px-4 sm:py-5"
    >
      <style>{css}</style>

      {/* Tifinagh watermarks */}
      <span className="sv-letter" style={{ fontSize: 190, top: '-3%', left: '4%' }}>ⵣ</span>
      <span className="sv-letter" style={{ fontSize: 140, bottom: '2%', right: '6%', animationDelay: '1.5s' }}>ⴰ</span>
      <span className="sv-letter" style={{ fontSize: 110, top: '30%', right: '40%', animationDelay: '3s' }}>ⵎ</span>
      <span className="sv-letter" style={{ fontSize: 90, bottom: '18%', left: '22%', animationDelay: '4.5s' }}>ⵍ</span>

      {/* floating decorations */}
      <div className="sv-blob" style={{ width: 160, height: 160, background: '#ffd36b', top: '6%', left: '-40px' }} />
      <div className="sv-blob" style={{ width: 110, height: 110, background: '#ff9ec4', top: '55%', right: '-30px', animationDelay: '1s' }} />
      <div className="sv-blob" style={{ width: 90, height: 90, background: '#8fd6ff', bottom: '8%', left: '12%', animationDelay: '2s' }} />
      <div className="sv-blob" style={{ width: 70, height: 70, background: '#b9a8ff', top: '12%', right: '18%', animationDelay: '3s' }} />

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="sv-drop text-center mb-5">
          <div className="inline-flex items-center gap-3">
            <div
              className="sv-bounce flex items-center justify-center"
              style={{
                width: 56,
                height: 56,
                borderRadius: 18,
                background: '#ff8a5c',
                color: '#fff',
                boxShadow: '0 5px 0 #e0683a',
              }}
            >
              <Users className="w-7 h-7" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ color: '#3b2f63' }}>
              هيا نجهّز اللعبة!
            </h1>
          </div>
        </div>

        {Stepper}

        {/* Sliding content */}
        <div key={step} className={dir === 'next' ? 'sv-slide-next' : 'sv-slide-back'}>
          {steps[step]}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4 mt-6 max-w-xl mx-auto">
          <button
            onClick={goBack}
            disabled={step === 0}
            className="sv-btn flex items-center gap-2 px-4 py-3 text-base sm:px-6 sm:py-4 sm:text-lg"
            style={{
              borderRadius: 22,
              background: '#fff',
              color: '#7c6cf0',
              boxShadow: '0 6px 0 rgba(0,0,0,.08)',
            }}
          >
            <ChevronRight className="w-6 h-6" />
            السابق
          </button>

          <button
            key={shakeKey}
            onClick={goNext}
            className={`sv-btn flex items-center gap-2 px-5 py-3 text-base sm:px-8 sm:py-4 sm:text-lg flex-1 justify-center ${shakeKey ? 'sv-shake' : ''}`}
            style={{
              borderRadius: 22,
              background:
                step === STEPS.length - 1
                  ? 'linear-gradient(135deg,#4cd18a,#2bb36a)'
                  : 'linear-gradient(135deg,#ffb36b,#ff7a59)',
              color: '#fff',
              boxShadow:
                step === STEPS.length - 1 ? '0 6px 0 #1f8a52' : '0 6px 0 #e0683a',
            }}
          >
            {step === STEPS.length - 1 ? (
              <>
                <Play className="w-6 h-6" />
                جاهزون؟
              </>
            ) : (
              <>
                التالي
                <ChevronLeft className="w-6 h-6" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="sv-drop fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full font-extrabold"
          style={{ background: '#3b2f63', color: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,.25)' }}
        >
          {toast}
        </div>
      )}

      {/* Team edit popup */}
      {editing !== null && teams[editing] && (
        <div
          className="sv-fade fixed inset-0 z-40 flex items-center justify-center p-4"
          style={{ background: 'rgba(59,47,99,.55)', backdropFilter: 'blur(4px)' }}
          onClick={() => setEditing(null)}
        >
          <div
            className="sv-card sv-pop w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setEditing(null)}
              className="sv-btn absolute top-4 left-4 flex items-center justify-center"
              style={{ width: 40, height: 40, borderRadius: 14, background: '#f1eefb', color: '#7c6cf0' }}
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center mb-5">
              <div className="sv-bounce">
                <Avatar team={teams[editing]} size={96} />
              </div>
              <span className="mt-2 font-bold" style={{ color: '#8d88a6' }}>
                الفريق {editing + 1}
              </span>
            </div>

            <label className="block font-extrabold mb-2" style={{ color: '#3b2f63' }}>
              اسم الفريق
            </label>
            <input
              autoFocus
              type="text"
              maxLength={20}
              value={teams[editing].name}
              onChange={(e) => updateTeam(editing, { name: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && setEditing(null)}
              className="sv-input mb-5"
              placeholder="اكتب اسم الفريق..."
            />

            <label className="block font-extrabold mb-3" style={{ color: '#3b2f63' }}>
              لون الفريق
            </label>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {colorOptions.map((color) => {
                const selected = teams[editing].color === color.hex
                return (
                  <button
                    key={color.hex}
                    onClick={() => updateTeam(editing, { color: color.hex })}
                    title={color.label}
                    className="sv-btn flex items-center justify-center"
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: '50%',
                      background: color.hex,
                      color: '#fff',
                      border: '4px solid #fff',
                      boxShadow: selected
                        ? `0 0 0 4px ${color.hex}`
                        : '0 3px 6px rgba(0,0,0,.2)',
                      transform: selected ? 'scale(1.15)' : undefined,
                    }}
                  >
                    {selected && <Check className="w-5 h-5" />}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setEditing(null)}
              className="sv-btn w-full py-4 text-lg flex items-center justify-center gap-2"
              style={{
                borderRadius: 20,
                background: 'linear-gradient(135deg,#4cd18a,#2bb36a)',
                color: '#fff',
                boxShadow: '0 6px 0 #1f8a52',
              }}
            >
              <Check className="w-6 h-6" />
              تم
            </button>
          </div>
        </div>
      )}

      {/* Confirm popup */}
      {showConfirm && (
        <div
          className="sv-fade fixed inset-0 z-40 flex items-center justify-center p-4"
          style={{ background: 'rgba(59,47,99,.55)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="sv-card sv-pop w-full max-w-lg p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-5xl mb-2 sv-bounce">🚀</div>
            <h3 className="text-2xl font-extrabold mb-4" style={{ color: '#3b2f63' }}>
              هل أنتم جاهزون؟
            </h3>

            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {teams.map((t, i) => (
                <div
                  key={i}
                  className="sv-pop flex items-center gap-2 px-3 py-2 rounded-full font-bold"
                  style={{
                    animationDelay: `${i * 60}ms`,
                    background: `${t.color}22`,
                    border: `3px solid ${t.color}`,
                    color: '#3b2f63',
                  }}
                >
                  <Avatar team={t} size={32} />
                  {t.name}
                </div>
              ))}
            </div>

            <p className="font-bold mb-6" style={{ color: '#8d88a6' }}>
              {teams.length} فرق • {groupCount} مجموعة • {groupCount * QUESTIONS_PER_GROUP} سؤال
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="sv-btn flex-1 py-4 text-lg"
                style={{ borderRadius: 20, background: '#f1eefb', color: '#7c6cf0', boxShadow: '0 6px 0 #ddd6f3' }}
              >
                تعديل
              </button>
              <button
                onClick={startGame}
                className="sv-btn flex-[2] py-4 text-lg flex items-center justify-center gap-2"
                style={{
                  borderRadius: 20,
                  background: 'linear-gradient(135deg,#4cd18a,#2bb36a)',
                  color: '#fff',
                  boxShadow: '0 6px 0 #1f8a52',
                }}
              >
                <Play className="w-6 h-6" />
                بدء المباراة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Countdown overlay — portaled to <body> so the transformed
          FitToViewport wrapper can't shrink it to the stage box */}
      {countdown !== null &&
        countdown > 0 &&
        createPortal(
          <div
            className="sv-fade fixed inset-0 z-[999] flex items-center justify-center"
            style={{
              background: 'linear-gradient(160deg,#ff8a5c,#7c6cf0)',
              margin: 0,
              padding: 0,
            }}
          >
            <div
              key={countdown}
              className="sv-count font-extrabold text-white"
              style={{
                fontSize: 'min(12rem, 42vw, 50vh)',
                lineHeight: 1,
                textShadow: '0 clamp(4px, 1.5vw, 10px) 0 rgba(0,0,0,.2)',
              }}
            >
              {countdown}
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}
