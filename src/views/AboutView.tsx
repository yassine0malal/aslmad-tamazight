import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import {
  Heart,
  Gamepad2,
  
  ArrowRight,
  Star,
} from 'lucide-react'
import { routes } from '@/lib/routes'
import imgMotto from '@/assets/images/about/motto.png'
import imgWords from '@/assets/images/about/words.png'
import imgTazrzit from '@/assets/images/about/tazrzit.png'
import imgTazrbit from '@/assets/images/about/tazrbit.png'

/* ─── Feature game icons ─── */
import iconNextLetter from '@/assets/icons/teams-games/next-letter.png'
import iconAnimal from '@/assets/icons/teams-games/animal.png'
import iconMind from '@/assets/icons/teams-games/mind.png'
import iconPictureQuiz from '@/assets/icons/teams-games/picture-quiz.png'
import iconKids from '@/assets/icons/class-games/kids.png'
import iconCulture from '@/assets/icons/culture/culture.png'

const values = [
  {
    emoji: 'ⵣ',
    title: 'الهوية الأمازيغية',
    desc: 'نعتز بتراثنا وهويتنا الأمازيغية العريقة، ونسعى لنقلها للأجيال القادمة.',
  },
  {
    emoji: <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="currentColor" viewBox="0 0 24.432 24.432" width="32" height="32" style={{ display: 'block' }}><g><g><path d="M6.42,9.301c1.771,0,3.205-1.435,3.205-3.208c0-1.105,0.389-2.117-0.465-2.691C8.648,3.053,6.4,2.888,5.736,2.888    c-0.79,0-1.817,0.644-2.376,1.119C2.665,4.594,3.213,5.111,3.213,6.092C3.213,7.866,4.646,9.301,6.42,9.301z M4.186,5.779    c0.589-0.107,0.989,0.087,0.989,0.087l0.984-0.479c0,0-0.501,0.724-0.051,0.479C7.11,5.53,8.231,5.67,8.801,5.782    c0.02,0.125,0.038,0.253,0.038,0.386c0,1.32-1.048,2.387-2.349,2.387c-1.294,0-2.343-1.067-2.343-2.387    C4.147,6.035,4.165,5.907,4.186,5.779z" /><path d="M22.066,5.643c-0.015-0.183-0.03-0.365-0.07-0.541c-0.127-1.124-1.133-3.408-4.02-3.34    c-2.488,0.059-3.031,1.932-3.162,3.072c-0.088,0.28-0.145,0.573-0.164,0.878c-3.236,0.565-2.88,3.849-0.904,3.905    c-0.188-1.715,0.63-2.745,0.945-3.076c0.291,1.771,1.82,3.132,3.672,3.132c1.756,0,3.222-1.223,3.619-2.858    c0.303,0.534,0.812,1.628,0.688,2.803C25.783,9.591,24.251,6.032,22.066,5.643z M18.363,8.617c-1.455,0-2.639-1.172-2.672-2.621    c0.531-0.193,0.925-1.113,0.925-1.113s0.315,0.108,0.315,1.147c0.551,0.192,1.508-1.614,1.508-1.614v1.423    c0.607,0.166,2.521-0.054,2.521-0.054l0.071,0.06c0.001,0.03,0.009,0.061,0.009,0.092C21.042,7.415,19.842,8.617,18.363,8.617z" /><polygon points="19.143,9.769 17.568,9.769 16.253,9.769 12.402,14.409 8.675,9.827 4.438,9.827 0,14.699 0.93,15.658     4.107,12.947 4.107,18.205 4.744,18.205 4.744,22.202 4.339,22.202 4.339,22.671 6.184,22.671 6.184,22.202 6.184,18.205     6.875,18.205 6.875,22.202 6.875,22.671 8.716,22.671 8.716,22.202 8.312,22.202 8.312,18.205 9.085,18.205 9.085,13.046     11.625,15.654 12.663,15.398 13.238,15.542 16.115,12.249 16.279,13.554 13.607,18.146 16.689,18.146 16.689,22.144     16.284,22.144 16.284,22.609 18.127,22.609 18.127,22.144 18.129,22.144 18.129,18.146 18.818,18.146 18.818,22.144     18.818,22.609 20.662,22.609 20.662,22.144 20.257,22.144 20.257,18.146 22.646,18.146 20.292,13.554 20.421,11.948 22.67,14.962     24.16,14.591 20.594,9.769   " /></g></g></svg>,
    title: 'الأطفال أولاً',
    desc: 'صممنا التطبيق ليكون ممتعاً وسهل الاستخدام للأطفال مع محتوى تعليمي جذاب.',
  },
  {
    emoji: <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}><path d="M17.5,12 C20.5375661,12 23,14.4624339 23,17.5 C23,20.5375661 20.5375661,23 17.5,23 C14.4624339,23 12,20.5375661 12,17.5 C12,14.4624339 14.4624339,12 17.5,12 Z M17.5,13.9992349 L17.4101244,14.0072906 C17.2060313,14.0443345 17.0450996,14.2052662 17.0080557,14.4093593 L17,14.4992349 L16.9996498,16.9992349 L14.4976498,17 L14.4077742,17.0080557 C14.2036811,17.0450996 14.0427494,17.2060313 14.0057055,17.4101244 L13.9976498,17.5 L14.0057055,17.5898756 C14.0427494,17.7939687 14.2036811,17.9549004 14.4077742,17.9919443 L14.4976498,18 L17.0006498,17.9992349 L17.0011076,20.5034847 L17.0091633,20.5933603 C17.0462073,20.7974534 17.207139,20.9583851 17.411232,20.995429 L17.5011076,21.0034847 L17.5909833,20.995429 C17.7950763,20.9583851 17.956008,20.7974534 17.993052,20.5933603 L18.0011076,20.5034847 L18.0006498,17.9992349 L20.5045655,18 L20.5944411,17.9919443 C20.7985342,17.9549004 20.9594659,17.7939687 20.9965098,17.5898756 L21.0045655,17.5 L20.9965098,17.4101244 C20.9594659,17.2060313 20.7985342,17.0450996 20.5944411,17.0080557 L20.5045655,17 L17.9996498,16.9992349 L18,14.4992349 L17.9919443,14.4093593 C17.9549004,14.2052662 17.7939687,14.0443345 17.5898756,14.0072906 L17.5,13.9992349 Z M12.02195,13.9997937 C11.3750475,15.010137 11,16.21127 11,17.5 C11,18.3838153 11.1763947,19.2264314 11.4958991,19.9945634 C8.94205586,19.8573327 7.5,18.7731072 7.5,16.75 L7.5,15.75 C7.5,14.7835017 8.28350169,14 9.25,14 L12.02195,13.9997937 Z M8.12599558,9.0000851 C8.04374524,9.3196794 8,9.65473108 8,10 C8,11.1155313 8.45664565,12.1244073 9.19320511,12.8498962 L9.35525927,13.0009561 L9.25,13 C8.94865366,13 8.65862814,13.0484702 8.38729437,13.1380397 C7.52254738,13.4234998 6.84765465,14.1264102 6.60122004,15.0081669 L6.5667905,15.0090369 C3.6578611,15.0090369 2,13.9192116 2,11.75 L2,10.75 C2,9.8318266 2.70711027,9.07880766 3.60647279,9.0058012 L3.75,9 L8.12599558,9.0000851 Z M12,7 C13.6568542,7 15,8.34314575 15,10 C15,11.6568542 13.6568542,13 12,13 C10.3431458,13 9,11.6568542 9,10 C9,8.34314575 10.3431458,7 12,7 Z M20.25,9 C21.2164983,9 22,9.78350169 22,10.75 L21.9989377,11.7120717 C22.0185903,12.0809152 21.988724,12.4190637 21.9114947,12.7263897 C20.751839,11.6544204 19.2023435,11 17.5,11 C16.9146982,11 16.3474651,11.077361 15.8079678,11.2224158 C15.9331115,10.8382591 16,10.4269409 16,10 C16,9.65473108 15.9562548,9.3196794 15.8740044,9.0000851 L20.25,9 Z M6.5,2 C8.15685425,2 9.5,3.34314575 9.5,5 C9.5,6.65685425 8.15685425,8 6.5,8 C4.84314575,8 3.5,6.65685425 3.5,5 C3.5,3.34314575 4.84314575,2 6.5,2 Z M17.5,2 C19.1568542,2 20.5,3.34314575 20.5,5 C20.5,6.65685425 19.1568542,8 17.5,8 C15.8431458,8 14.5,6.65685425 14.5,5 C14.5,3.34314575 15.8431458,2 17.5,2 Z" /></svg>,
    title: 'للجميع',
    desc: 'سواء كنت طفلاً أو بالغاً، مبتدئاً أو متقدماً — أبوابنا مفتوحة للجميع.',
  },
  {
    emoji: <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 64 64" fill="currentColor" style={{ display: 'block' }}><path d="M61.876 44.196l-4.394-22.105c-.966-5.144-5.386-9.037-10.714-9.087V13H17.337c-5.375-.002-9.853 3.914-10.825 9.093L2.125 44.196c-.082.39-.13.79-.125 1.205C1.995 48.493 4.461 51 7.504 51c1.962 0 3.683-1.039 4.661-2.607l7.24-9.039a6.422 6.422 0 0 0 4.418 1.765c3.578-.002 6.479-2.949 6.479-6.591l3.5-.001c0 3.639 2.904 6.59 6.482 6.59a6.418 6.418 0 0 0 4.355-1.704l7.195 8.98c.977 1.564 2.7 2.607 4.657 2.607c3.043 0 5.512-2.507 5.509-5.601a5.796 5.796 0 0 0-.124-1.203m-40.955-23.01c.703-.716 1.506-.507 1.789.465l-.004 3.126c-.279.973-1.082 1.183-1.783.468l-.719-.73a1.866 1.866 0 0 1 0-2.6l.717-.729m-5.117-3.427l3.072-.003c.955.282 1.16 1.102.455 1.817l-.712.728a1.794 1.794 0 0 1-2.56 0l-.718-.729c-.704-.715-.499-1.534.463-1.813m-2.047 7.483c-.705.718-1.511.508-1.79-.465l.004-3.126c.275-.973 1.081-1.182 1.784-.466l.716.729a1.864 1.864 0 0 1 0 2.6l-.714.728m5.119 3.429l-3.076.003c-.958-.286-1.163-1.101-.458-1.817l.718-.729a1.795 1.795 0 0 1 2.559-.001l.715.73c.702.716.495 1.531-.458 1.814m4.942 10.268c-2.396.002-4.343-1.973-4.343-4.413c0-2.438 1.947-4.416 4.348-4.416c2.395.003 4.339 1.978 4.339 4.415c.003 2.442-1.944 4.418-4.344 4.414m20.263-19.406c.996.002 1.805.825 1.805 1.839c.002 1.019-.807 1.844-1.809 1.839c-1 .003-1.809-.82-1.809-1.837c.001-1.016.809-1.839 1.813-1.841m-3.797 19.408c-2.396 0-4.34-1.977-4.342-4.415c.002-2.438 1.945-4.416 4.342-4.416c2.401.002 4.346 1.978 4.344 4.416c0 2.438-1.942 4.413-4.344 4.415m3.963-10.208c-1 0-1.81-.826-1.81-1.841c-.001-1.017.81-1.841 1.81-1.841s1.808.824 1.811 1.841c0 1.016-.813 1.841-1.811 1.841m5.045-11.037c.999-.001 1.809.822 1.811 1.839c-.002 1.014-.812 1.839-1.811 1.839c-1 0-1.809-.825-1.809-1.839c-.002-1.018.805-1.843 1.809-1.839m.168 9.197c-.998.001-1.808-.822-1.805-1.838c-.003-1.017.807-1.842 1.807-1.839c.998-.002 1.81.82 1.81 1.836c-.001 1.018-.812 1.842-1.812 1.841" /></svg>,
    title: 'التعلم باللعب',
    desc: 'نؤمن بأن أفضل طريقة للتعلم هي من خلال المرح واللعب والتحديات التفاعلية.',
  },
]

const features = [
  { icon: iconNextLetter, title: 'تحدي الحرف التالي', desc: 'اختبر معرفتك بتسلسل حروف تيفيناغ.' },
  { icon: iconAnimal, title: 'مباراة الحيوانات', desc: 'تعلّم أسماء الحيوانات بالأمازيغية.' },
  { icon: iconMind, title: 'لعبة الذاكرة', desc: 'درّب ذاكرتك باكتشاف الأزواج.' },
  { icon: iconPictureQuiz, title: 'أمساسا ن توالفت', desc: 'لعبة التخمين بالصور.' },
  { icon: iconKids, title: 'ألعاب الألوان', desc: 'تعلّم أسماء الألوان.' },
  { icon: iconCulture, title: 'المعرض الثقافي', desc: 'استكشف التراث الأمازيغي.' },
]

/* Reusable alternating row: image on left or right + content on the opposite side */
function AltRow({
  image,
  alt,
  imageSide,
  children,
  delay,
  visible,
}: {
  image: string
  alt: string
  imageSide: 'left' | 'right'
  children: React.ReactNode
  delay: number
  visible: boolean
}) {
  const isLeft = imageSide === 'left'

  return (
    <motion.div
      className="md:flex items-center gap-10 p-8 md:p-12"
      style={{
        background: 'var(--clay-surface-card)',
        border: '1px solid var(--clay-hairline)',
        borderRadius: '6px',
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {/* Image */}
      <div
        className={`mb-6 md:mb-0 md:w-5/12 ${isLeft ? 'md:order-1' : 'md:order-2'}`}
      >
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
          animate={visible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: delay + 0.1 }}
        >
          <img
            src={image}
            alt={alt}
            className="w-full h-auto object-contain max-h-[300px] md:max-h-[400px]"
          />
        </motion.div>
      </div>

      {/* Content */}
      <div
        className={`md:w-7/12 ${isLeft ? 'md:order-2' : 'md:order-1'}`}
      >
        <motion.div
          initial={{ opacity: 0, x: isLeft ? 30 : -30 }}
          animate={visible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: delay + 0.15 }}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function AboutView() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className="min-h-screen w-full pb-20 relative overflow-hidden"
      style={{ background: 'var(--clay-canvas)' }}
    >
      {/* Decorative background */}
      <motion.div
        className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full opacity-[0.03] pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--clay-lavender), transparent)' }}
        animate={{ x: [0, 40, -30, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full opacity-[0.03] pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--clay-ochre), transparent)' }}
        animate={{ x: [0, -40, 30, 0], y: [0, 30, -20, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-5xl mx-auto relative z-10 px-4 pt-16 md:pt-20">
        {/* ═══════════ Section 1: Hero — image RIGHT, content LEFT ═══════════ */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="md:flex items-center gap-10">
            {/* Left: text */}
            <div className="md:w-1/2 text-center md:text-right mb-8 md:mb-0">
              <motion.div
                className="inline-flex items-center gap-2 px-5 py-2 mb-5"
                style={{ background: 'var(--clay-surface-card)', borderRadius: '6px' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={visible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Heart className="w-4 h-4" style={{ color: 'var(--clay-coral)' }} />
                <span className="clay-caption font-semibold" style={{ color: 'var(--clay-coral)' }}>
                  ⵉⵎⵓⵔⴰⵔ · من نحن
                </span>
              </motion.div>

              <motion.h1
                className="clay-display-sm mb-4"
                style={{ color: 'var(--clay-ink)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <span className="tifinagh-text">ⴰⵙⵍⵎⴰⵔ</span>
                <br />
                حب الثقافة، شغف التعليم
              </motion.h1>

              <motion.p
                className="tifinagh-text text-xl mb-4"
                style={{ color: 'var(--clay-muted)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                ⵜⴰⵢⵔⵉ ⵏ ⵜⵓⵙⵙⵏⴰ, ⴰⵣⵣⴰⵔⴰ ⵏ ⵓⵙⵍⵎⴷ
              </motion.p>

              <motion.p
                className="clay-body-md"
                style={{ color: 'var(--clay-muted-soft)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                منصة تعليمية تفاعلية تهدف إلى نشر وتعليم اللغة والثقافة الأمازيغية
                للأطفال والكبار بأسلوب ممتع وشيق.
              </motion.p>
            </div>

            {/* Right: image */}
            <div className="md:w-1/2 flex justify-center">
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={visible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <img
                  src={imgMotto}
                  alt="ⴰⵙⵍⵎⴰⵔ"
                  className="w-full max-w-sm h-auto object-contain"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ═══════════ Section 2: Story — image LEFT, content RIGHT ═══════════ */}
        <AltRow
          image={imgWords}
          alt="ⵜⵓⵜⵍⴰⵢⵜ ⵜⴰⵎⴰⵣⵉⵖⵜ"
          imageSide="left"
          delay={0.3}
          visible={visible}
        >            <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 flex items-center justify-center shrink-0"
              style={{ background: 'var(--clay-surface-soft)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 8V12L14.5 14.5" stroke="var(--clay-ochre)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M5.60423 5.60423L5.0739 5.0739V5.0739L5.60423 5.60423ZM4.33785 6.87061L3.58786 6.87438C3.58992 7.28564 3.92281 7.61853 4.33408 7.6206L4.33785 6.87061ZM6.87963 7.63339C7.29384 7.63547 7.63131 7.30138 7.63339 6.88717C7.63547 6.47296 7.30138 6.13549 6.88717 6.13341L6.87963 7.63339ZM5.07505 4.32129C5.07296 3.90708 4.7355 3.57298 4.32129 3.57506C3.90708 3.57715 3.57298 3.91462 3.57507 4.32882L5.07505 4.32129ZM3.75 12C3.75 11.5858 3.41421 11.25 3 11.25C2.58579 11.25 2.25 11.5858 2.25 12H3.75ZM16.8755 20.4452C17.2341 20.2378 17.3566 19.779 17.1492 19.4204C16.9418 19.0619 16.483 18.9393 16.1245 19.1468L16.8755 20.4452ZM19.1468 16.1245C18.9393 16.483 19.0619 16.9418 19.4204 17.1492C19.779 17.3566 20.2378 17.2341 20.4452 16.8755L19.1468 16.1245ZM5.14033 5.07126C4.84598 5.36269 4.84361 5.83756 5.13505 6.13191C5.42648 6.42626 5.90134 6.42862 6.19569 6.13719L5.14033 5.07126ZM18.8623 5.13786C15.0421 1.31766 8.86882 1.27898 5.0739 5.0739L6.13456 6.13456C9.33366 2.93545 14.5572 2.95404 17.8017 6.19852L18.8623 5.13786ZM5.0739 5.0739L3.80752 6.34028L4.86818 7.40094L6.13456 6.13456L5.0739 5.0739ZM4.33408 7.6206L6.87963 7.63339L6.88717 6.13341L4.34162 6.12062L4.33408 7.6206ZM5.08784 6.86684L5.07505 4.32129L3.57507 4.32882L3.58786 6.87438L5.08784 6.86684ZM12 3.75C16.5563 3.75 20.25 7.44365 20.25 12H21.75C21.75 6.61522 17.3848 2.25 12 2.25V3.75ZM12 20.25C7.44365 20.25 3.75 16.5563 3.75 12H2.25C2.25 17.3848 6.61522 21.75 12 21.75V20.25ZM16.1245 19.1468C14.9118 19.8483 13.5039 20.25 12 20.25V21.75C13.7747 21.75 15.4407 21.2752 16.8755 20.4452L16.1245 19.1468ZM20.25 12C20.25 13.5039 19.8483 14.9118 19.1468 16.1245L20.4452 16.8755C21.2752 15.4407 21.75 13.7747 21.75 12H20.25ZM6.19569 6.13719C7.68707 4.66059 9.73646 3.75 12 3.75V2.25C9.32542 2.25 6.90113 3.32791 5.14033 5.07126L6.19569 6.13719Z" fill="var(--clay-ochre)" />
              </svg>
            </div>
            <h2 className="clay-title-lg" style={{ color: 'var(--clay-ink)' }}>
              قصتنا
            </h2>
          </div>

          <div className="space-y-4 clay-body-md leading-relaxed" style={{ color: 'var(--clay-ink)' }}>
            <p>
              <strong>ⴰⵙⵍⵎⴰⵔ (Aslmad)</strong> — كلمة أمازيغية تعني "المعلّم" — وُلدت من حب عميق
              لثقافتنا الأمازيغية الغنية وإرثها العريق. نحن مجموعة من الشباب المؤمن بأن لغتنا
              وهويتنا تستحقان العيش والازدهار في العصر الرقمي.
            </p>
            <p>
              لاحظنا أن الكثير من الأطفال واليافعين، وحتى الكبار، يجدون صعوبة في تعلم حروف
              تيفيناغ واللغة الأمازيغية. الأدوات التقليدية كانت جافة ومملة، تفتقر إلى عنصر
              التشويق والتحفيز الذي يحتاجه المتعلمون اليوم.
            </p>
            <p>
              لذا، قررنا أن نصنع التغيير بأيدينا. أنشأنا <strong>ⴰⵙⵍⵎⴰⵔ</strong> ليكون منصة
              تعليمية تفاعلية تجمع بين المتعة والفائدة — حيث يتحول تعلم الأمازيغية إلى مغامرة
              شيقة مليئة بالتحديات والألعاب والمكافآت.
            </p>
          </div>
        </AltRow>

        {/* ═══════════ Section 3: Values — image RIGHT, cards LEFT ═══════════ */}
        <div className="mb-16">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <h2 className="clay-title-lg my-4 mt-8 " style={{ color: 'var(--clay-ink)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="var(--clay-ochre)" width="22" height="22" viewBox="0 0 56 56" className="inline-block ml-1.5 -mt-0.5 mr-3" style={{ verticalAlign: 'middle' }}><path d="M 26.6875 12.6602 C 26.9687 12.6602 27.1094 12.4961 27.1797 12.2383 C 27.9062 8.3242 27.8594 8.2305 31.9375 7.4570 C 32.2187 7.4102 32.3828 7.2461 32.3828 6.9648 C 32.3828 6.6836 32.2187 6.5195 31.9375 6.4726 C 27.8828 5.6524 28.0000 5.5586 27.1797 1.6914 C 27.1094 1.4336 26.9687 1.2695 26.6875 1.2695 C 26.4062 1.2695 26.2656 1.4336 26.1953 1.6914 C 25.3750 5.5586 25.5156 5.6524 21.4375 6.4726 C 21.1797 6.5195 20.9922 6.6836 20.9922 6.9648 C 20.9922 7.2461 21.1797 7.4102 21.4375 7.4570 C 25.5156 8.2774 25.4687 8.3242 26.1953 12.2383 C 26.2656 12.4961 26.4062 12.6602 26.6875 12.6602 Z M 15.3438 28.7852 C 15.7891 28.7852 16.0938 28.5039 16.1406 28.0821 C 16.9844 21.8242 17.1953 21.8242 23.6641 20.5821 C 24.0860 20.5117 24.3906 20.2305 24.3906 19.7852 C 24.3906 19.3633 24.0860 19.0586 23.6641 18.9883 C 17.1953 18.0977 16.9609 17.8867 16.1406 11.5117 C 16.0938 11.0899 15.7891 10.7852 15.3438 10.7852 C 14.9219 10.7852 14.6172 11.0899 14.5703 11.5352 C 13.7969 17.8164 13.4687 17.7930 7.0469 18.9883 C 6.6250 19.0821 6.3203 19.3633 6.3203 19.7852 C 6.3203 20.2539 6.6250 20.5117 7.1406 20.5821 C 13.5156 21.6133 13.7969 21.7774 14.5703 28.0352 C 14.6172 28.5039 14.9219 28.7852 15.3438 28.7852 Z M 31.2344 54.7305 C 31.8438 54.7305 32.2891 54.2852 32.4062 53.6524 C 34.0703 40.8086 35.8750 38.8633 48.5781 37.4570 C 49.2344 37.3867 49.6797 36.8945 49.6797 36.2852 C 49.6797 35.6758 49.2344 35.2070 48.5781 35.1133 C 35.8750 33.7070 34.0703 31.7617 32.4062 18.9180 C 32.2891 18.2852 31.8438 17.8633 31.2344 17.8633 C 30.6250 17.8633 30.1797 18.2852 30.0860 18.9180 C 28.4219 31.7617 26.5938 33.7070 13.9140 35.1133 C 13.2344 35.2070 12.7891 35.6758 12.7891 36.2852 C 12.7891 36.8945 13.2344 37.3867 13.9140 37.4570 C 26.5703 39.1211 28.3281 40.8321 30.0860 53.6524 C 30.1797 54.2852 30.6250 54.7305 31.2344 54.7305 Z"/></svg>
              قيمنا ومبادئنا
            </h2>
            <p className="clay-body-md" style={{ color: 'var(--clay-muted)' }}>
              ما نؤمن به وما يدفعنا للاستمرار
            </p>
          </motion.div>

          <AltRow
            image={imgTazrzit}
            alt="ⵜⴰⵣⵔⵣⵉⵜ"
            imageSide="right"
            delay={0.4}
            visible={visible}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {values.map((value, idx) => (
                <motion.div
                  key={idx}
                  className="p-5 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: 'var(--clay-surface-soft)',
                    border: '1px solid var(--clay-hairline)',
                    borderRadius: '6px',
                  }}
                  initial={{ opacity: 0, y: 15 }}
                  animate={visible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.35, delay: 0.45 + idx * 0.07 }}
                >
                  <span className="text-3xl block mb-2">{value.emoji}</span>
                  <h3 className="clay-body-sm font-bold mb-1" style={{ color: 'var(--clay-ink)' }}>
                    {value.title}
                  </h3>
                  <p className="clay-caption leading-relaxed" style={{ color: 'var(--clay-muted)' }}>
                    {value.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </AltRow>
        </div>

        {/* ═══════════ Section 4: Features — image LEFT, cards RIGHT ═══════════ */}
        <div className="mb-16">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="clay-title-lg mb-2" style={{ color: 'var(--clay-ink)' }}>
              <Gamepad2 className="w-5 h-5 inline-block ml-1.5 -mt-0.5 mr-3" style={{ color: 'var(--clay-lavender)' }} />
              ماذا نقدم؟
            </h2>

            <p className="clay-body-md" style={{ color: 'var(--clay-muted)' }}>
              مجموعة من الألعاب والأنشطة التفاعلية
            </p>
          </motion.div>

          <AltRow
            image={imgTazrbit}
            alt="ⵜⴰⵣⵔⴱⵉⵜ"
            imageSide="left"
            delay={0.55}
            visible={visible}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  className="p-6 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: 'var(--clay-surface-soft)',
                    border: '1px solid var(--clay-hairline)',
                    borderRadius: '6px',
                  }}
                  initial={{ opacity: 0, y: 15 }}
                  animate={visible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.35, delay: 0.6 + idx * 0.05 }}
                >
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="w-10 h-10 object-contain mx-auto mb-2"
                  />
                  <h3 className="clay-body-sm font-bold mb-0.5" style={{ color: 'var(--clay-ink)' }}>
                    {feature.title}
                  </h3>
                  <p className="clay-caption" style={{ color: 'var(--clay-muted)' }}>
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </AltRow>
        </div>

        {/* ═══════════ Section 5: CTA ═══════════ */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.65 }}
        >
          <div
            className="p-8 md:p-10"
            style={{
              background: 'var(--clay-surface-card)',
              border: '1px solid var(--clay-hairline)',
              borderRadius: '6px',
            }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="mb-4"
            >
              <Star className="w-10 h-10 mx-auto" style={{ color: 'var(--clay-ochre)' }} />
            </motion.div>
            <h2 className="clay-title-lg mb-3" style={{ color: 'var(--clay-ink)' }}>
              {/* <Globe className="w-5 h-5 inline-block ml-1.5 -mt-0.5" style={{ color: 'var(--clay-lavender)' }} /> */}
              انضم إلينا في هذه الرحلة
            </h2>
            <p className="clay-body-md mb-6 max-w-lg mx-auto" style={{ color: 'var(--clay-muted)' }}>
              ⴰⵙⵍⵎⴰⵔ ليس مجرد تطبيق — هو رسالة حب لثقافتنا. ندعوك لتكون جزءاً من هذه
              المغامرة التعليمية، وتساعدنا في نشر جمال اللغة الأمازيغية للأجيال القادمة.
            </p>
            <button
              onClick={() => navigate(routes.setup)}
              className="inline-flex items-center gap-2 px-6 py-3 transition-all duration-200"
              style={{
                background: 'var(--clay-ink)',
                color: '#fff',
                fontWeight: 500,
              }}
            >
              ابدأ التعلم الآن
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* ═══════════ Section 6: Footer ═══════════ */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.75 }}
        >
          <div
            className="inline-flex items-center gap-3 px-6 py-3"
            style={{ background: 'var(--clay-surface-card)', borderRadius: '6px' }}
          >
            <span className="clay-caption" style={{ color: 'var(--clay-muted-soft)' }}>
              ⵜⴰⵔⵎⵉⵜ ⵏ ⵜⵓⵙⵙⵏⴰ · ⴰⵙⵙ ⵏⵖ · ⴲⴰⵎⴰⵣⵉⵖ ⵉⵏⵓⵛⵎⵔ
            </span>
          </div>
          <p className="clay-caption mt-3" style={{ color: 'var(--clay-muted-soft)' }}>
            © {new Date().getFullYear()} ⴰⵙⵍⵎⴰⵔ — أصنع بحب ⵣ
          </p>
        </motion.div>
      </div>
    </div>
  )
}
