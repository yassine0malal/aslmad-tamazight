import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Play,
  Star,
  CheckCircle,
  Mail,
  MapPin,
  Send,
  BookOpen,
  Gamepad2,
  GraduationCap,
  Sparkles,
  Globe,
  Users,
  Target,
  ArrowLeft,
} from 'lucide-react'
import { routes } from '@/lib/routes'
import imgMotto from '@/assets/images/home/tamazight-symbol.png'
import imgHomeHero from '@/assets/images/home/index.png'
import imgBread from '@/assets/images/home/bread.png'

/* ───────────────────────────────────────────────────────────────
   INTERFACE
   ─────────────────────────────────────────────────────────────── */

interface SectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

interface PathwayBlock {
  id: string
  title: string
  subtitle: string
  body: string
  image: string
  alt: string
  features: string[]
}

/* ───────────────────────────────────────────────────────────────
   CONSTANTS
   ─────────────────────────────────────────────────────────────── */

const SECTIONS_TOP_BOTTOM = 'py-24'
const CONTAINER = 'mx-auto px-8 md:px-16'
const MAX_W = 'max-w-[1280px]'

const pathways: PathwayBlock[] = [
  {
    id: 'p1',
    title: 'تعلم الحروف',
    subtitle: 'ⵜⴰⵣⵎⵔⵜ ⵏ ⵉⵔⵔⴰⵜⵏ',
    body: 'انطلق في رحلة شيقة لاكتشاف حروف تيفيناغ. لعبة "الحرف التالي" تختبر معرفتك بتسلسل الحروف الأمازيغية وتدربك على التعرف عليها بسرعة.',
    image: imgMotto,
    alt: 'تعلم حروف التيفيناغ',
    features: ['تسلسل الحروف التفاعلي', 'تصحيح فوري مع شرح', 'مستويات صعوبة متدرجة'],
  },
  {
    id: 'p2',
    title: 'مباراة الحيوانات',
    subtitle: 'ⴰⵎⵓⵔⴰⵔ ⵏ ⵉⵎⵓⴷⴰⵔ',
    body: 'تعلّم أسماء الحيوانات باللغة الأمازيغية من خلال لعبة المطابقة الممتعة. اختر الحرف الصحيح لكل حيوان وكنز معلوماتك.',
    image: imgHomeHero,
    alt: 'لعبة مباراة الحيوانات',
    features: ['رسومات حيوانات جميلة', 'نطق صحيح للأسماء', 'مجموعة واسعة من الحيوانات'],
  },
  {
    id: 'p3',
    title: 'لعبة الذاكرة',
    subtitle: 'ⴰⵎⵓⵔⴰⵔ ⵏ ⵓⵣⵎⵣⵉⵡ',
    body: 'درب ذاكرتك البصرية من خلال لعبة البحث عن الأزواج المتطابقة. كل بطاقة تحمل رمزاً أمازيغياً جميلاً ينتظر من يكتشفه.',
    image: imgBread,
    alt: 'لعبة الذاكرة',
    features: ['مستويات متعددة', 'مؤقت زمني للتحدي', 'رسومات تراثية'],
  },
  {
    id: 'p4',
    title: 'أمساسا ن توالفت',
    subtitle: 'ⵜⴰⵎⵙⵙⵏⵜ ⵏ ⵜⵡⵏⴼⵜ',
    body: 'لعبة التخمين بالصور التي تختبر معرفتك بالثقافة الأمازيغية. حل الألغاز واستمتع برحلة تعليمية ممتعة.',
    image: imgHomeHero,
    alt: 'لعبة أمساسا',
    features: ['ألغاز مصورة', 'محتوى ثقافي غني', 'تحديات يومية'],
  },
  {
    id: 'p5',
    title: 'المعرض الثقافي',
    subtitle: 'ⴰⵎⵓⵔⴰⵔ ⵏ ⵉⵎⵓⴷⴰⵔ',
    body: 'استكشف التراث الأمازيغي الغني من خلال معرضنا الثقافي التفاعلي. تعرف على الملابس التقليدية، الطعام، العادات والتقاليد.',
    image: imgBread,
    alt: 'المعرض الثقافي الأمازيغي',
    features: ['صور تراثية أصيلة', 'شروحات مفصلة', 'اكتشف تنوع الثقافة'],
  },
]


const featureCards = [
  {
    title: 'تعليم باللعب',
    icon: <Gamepad2 className="w-8 h-8" />,
    desc: 'ألعاب تفاعلية محفزة تجعل تعلم الأمازيغية مغامرة شيقة.',
    accent: '#b8a4ed',
  },
  {
    title: 'منهجية متكاملة',
    icon: <GraduationCap className="w-8 h-8" />,
    desc: 'برنامج تعليمي متدرج يغطي الحروف والمفردات والقواعد.',
    accent: '#a4d4c5',
  },
  {
    title: 'للأطفال والكبار',
    icon: <Users className="w-8 h-8" />,
    desc: 'محتوى يناسب جميع الأعمار والمستويات من المبتدئين إلى المتقدمين.',
    accent: '#ffb084',
  },
  {
    title: 'ثقافة أصيلة',
    icon: <Globe className="w-8 h-8" />,
    desc: 'غوص في عمق الثقافة الأمازيغية بتصاميم ورموز مستوحاة من التراث.',
    accent: '#e8b94a',
  },
]

const insightsArticles = [
  {
    featured: true,
    title: 'أهمية تعليم الأمازيغية للأطفال في العصر الرقمي',
    excerpt: 'في عصر العولمة والرقمنة، أصبح الحفاظ على الهوية اللغوية والثقافية تحدياً كبيراً. تعلم اللغة الأمازيغية...',
    category: 'تعليم',
    author: 'فريق أسمداس',
    date: '٢٠ يناير ٢٠٢٦',
    image: imgMotto,
  },
  {
    featured: false,
    title: 'كيف تساعد الألعاب في تعلم اللغات؟',
    excerpt: 'الألعاب التعليمية تحفز الدماغ وتجعل التعلم تجربة ممتعة وفعالة.',
    category: 'أبحاث',
    date: '١٥ يناير ٢٠٢٦',
  },
  {
    featured: false,
    title: 'رحلة حرف تيفيناغ عبر التاريخ',
    excerpt: 'من النقوش الصخرية القديمة إلى الشاشات الرقمية، تطور حرف تيفيناغ عبر آلاف السنين.',
    category: 'تاريخ',
    date: '١٠ يناير ٢٠٢٦',
  },
  {
    featured: false,
    title: 'نصائح لتعليم الأطفال الحروف',
    excerpt: 'طرق مبتكرة لتعليم الأطفال حروف تيفيناغ بطريقة ممتعة وفعالة.',
    category: 'نصائح',
    date: '٥ يناير ٢٠٢٦',
  },
]

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const start = performance.now()

          const animate = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(animate)
          }

          requestAnimationFrame(animate)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

/* ─── SVG Icon Components ─── */

function DiceIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor" className={className}>
      <path d="M61.876 44.196l-4.394-22.105c-.966-5.144-5.386-9.037-10.714-9.087V13H17.337c-5.375-.002-9.853 3.914-10.825 9.093L2.125 44.196c-.082.39-.13.79-.125 1.205C1.995 48.493 4.461 51 7.504 51c1.962 0 3.683-1.039 4.661-2.607l7.24-9.039a6.422 6.422 0 0 0 4.418 1.765c3.578-.002 6.479-2.949 6.479-6.591l3.5-.001c0 3.639 2.904 6.59 6.482 6.59a6.418 6.418 0 0 0 4.355-1.704l7.195 8.98c.977 1.564 2.7 2.607 4.657 2.607c3.043 0 5.512-2.507 5.509-5.601a5.796 5.796 0 0 0-.124-1.203m-40.955-23.01c.703-.716 1.506-.507 1.789.465l-.004 3.126c-.279.973-1.082 1.183-1.783.468l-.719-.73a1.866 1.866 0 0 1 0-2.6l.717-.729m-5.117-3.427l3.072-.003c.955.282 1.16 1.102.455 1.817l-.712.728a1.794 1.794 0 0 1-2.56 0l-.718-.729c-.704-.715-.499-1.534.463-1.813m-2.047 7.483c-.705.718-1.511.508-1.79-.465l.004-3.126c.275-.973 1.081-1.182 1.784-.466l.716.729a1.864 1.864 0 0 1 0 2.6l-.714.728m5.119 3.429l-3.076.003c-.958-.286-1.163-1.101-.458-1.817l.718-.729a1.795 1.795 0 0 1 2.559-.001l.715.73c.702.716.495 1.531-.458 1.814m4.942 10.268c-2.396.002-4.343-1.973-4.343-4.413c0-2.438 1.947-4.416 4.348-4.416c2.395.003 4.339 1.978 4.339 4.415c.003 2.442-1.944 4.418-4.344 4.414m20.263-19.406c.996.002 1.805.825 1.805 1.839c.002 1.019-.807 1.844-1.809 1.839c-1 .003-1.809-.82-1.809-1.837c.001-1.016.809-1.839 1.813-1.841m-3.797 19.408c-2.396 0-4.34-1.977-4.342-4.415c.002-2.438 1.945-4.416 4.342-4.416c2.401.002 4.346 1.978 4.344 4.416c0 2.438-1.942 4.413-4.344 4.415m3.963-10.208c-1 0-1.81-.826-1.81-1.841c-.001-1.017.81-1.841 1.81-1.841s1.808.824 1.811 1.841c0 1.016-.813 1.841-1.811 1.841m5.045-11.037c.999-.001 1.809.822 1.811 1.839-.002 1.014-.812 1.839-1.811 1.839-1 0-1.809-.825-1.809-1.839-.002-1.018.805-1.843 1.809-1.839m.168 9.197c-.998.001-1.808-.822-1.805-1.838-.003-1.017.807-1.842 1.807-1.839.998-.002 1.81.82 1.81 1.836-.001 1.018-.812 1.842-1.812 1.841" />
    </svg>
  )
}

function ChildrenIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.432 24.432" fill="currentColor" className={className}>
      <path d="M6.42,9.301c1.771,0,3.205-1.435,3.205-3.208c0-1.105,0.389-2.117-0.465-2.691C8.648,3.053,6.4,2.888,5.736,2.888c-0.79,0-1.817,0.644-2.376,1.119C2.665,4.594,3.213,5.111,3.213,6.092C3.213,7.866,4.646,9.301,6.42,9.301z M4.186,5.779c0.589-0.107,0.989,0.087,0.989,0.087l0.984-0.479c0,0-0.501,0.724-0.051,0.479C7.11,5.53,8.231,5.67,8.801,5.782c0.02,0.125,0.038,0.253,0.038,0.386c0,1.32-1.048,2.387-2.349,2.387c-1.294,0-2.343-1.067-2.343-2.387C4.147,6.035,4.165,5.907,4.186,5.779z" />
      <path d="M22.066,5.643c-0.015-0.183-0.03-0.365-0.07-0.541c-0.127-1.124-1.133-3.408-4.02-3.34c-2.488,0.059-3.031,1.932-3.162,3.072c-0.088,0.28-0.145,0.573-0.164,0.878c-3.236,0.565-2.88,3.849-0.904,3.905c-0.188-1.715,0.63-2.745,0.945-3.076c0.291,1.771,1.82,3.132,3.672,3.132c1.756,0,3.222-1.223,3.619-2.858c0.303,0.534,0.812,1.628,0.688,2.803C25.783,9.591,24.251,6.032,22.066,5.643z M18.363,8.617c-1.455,0-2.639-1.172-2.672-2.621c0.531-0.193,0.925-1.113,0.925-1.113s0.315,0.108,0.315,1.147c0.551,0.192,1.508-1.614,1.508-1.614v1.423c0.607,0.166,2.521-0.054,2.521-0.054l0.071,0.06c0.001,0.03,0.009,0.061,0.009,0.092C21.042,7.415,19.842,8.617,18.363,8.617z" />
      <polygon points="19.143,9.769 17.568,9.769 16.253,9.769 12.402,14.409 8.675,9.827 4.438,9.827 0,14.699 0.93,15.658 4.107,12.947 4.107,18.205 4.744,18.205 4.744,22.202 4.339,22.202 4.339,22.671 6.184,22.671 6.184,22.202 6.184,18.205 6.875,18.205 6.875,22.202 6.875,22.671 8.716,22.671 8.716,22.202 8.312,22.202 8.312,18.205 9.085,18.205 9.085,13.046 11.625,15.654 12.663,15.398 13.238,15.542 16.115,12.249 16.279,13.554 13.607,18.146 16.689,18.146 16.689,22.144 16.284,22.144 16.284,22.609 18.127,22.609 18.127,22.144 18.129,22.144 18.129,18.146 18.818,18.146 18.818,22.144 18.818,22.609 20.662,22.609 20.662,22.144 20.257,22.144 20.257,18.146 22.646,18.146 20.292,13.554 20.421,11.948 22.67,14.962 24.16,14.591 20.594,9.769" />
    </svg>
  )
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" fill="currentColor" className={className}>
      <path d="M 26.6875 12.6602 C 26.9687 12.6602 27.1094 12.4961 27.1797 12.2383 C 27.9062 8.3242 27.8594 8.2305 31.9375 7.4570 C 32.2187 7.4102 32.3828 7.2461 32.3828 6.9648 C 32.3828 6.6836 32.2187 6.5195 31.9375 6.4726 C 27.8828 5.6524 28.0000 5.5586 27.1797 1.6914 C 27.1094 1.4336 26.9687 1.2695 26.6875 1.2695 C 26.4062 1.2695 26.2656 1.4336 26.1953 1.6914 C 25.3750 5.5586 25.5156 5.6524 21.4375 6.4726 C 21.1797 6.5195 20.9922 6.6836 20.9922 6.9648 C 20.9922 7.2461 21.1797 7.4102 21.4375 7.4570 C 25.5156 8.2774 25.4687 8.3242 26.1953 12.2383 C 26.2656 12.4961 26.4062 12.6602 26.6875 12.6602 Z M 15.3438 28.7852 C 15.7891 28.7852 16.0938 28.5039 16.1406 28.0821 C 16.9844 21.8242 17.1953 21.8242 23.6641 20.5821 C 24.0860 20.5117 24.3906 20.2305 24.3906 19.7852 C 24.3906 19.3633 24.0860 19.0586 23.6641 18.9883 C 17.1953 18.0977 16.9609 17.8867 16.1406 11.5117 C 16.0938 11.0899 15.7891 10.7852 15.3438 10.7852 C 14.9219 10.7852 14.6172 11.0899 14.5703 11.5352 C 13.7969 17.8164 13.4687 17.7930 7.0469 18.9883 C 6.6250 19.0821 6.3203 19.3633 6.3203 19.7852 C 6.3203 20.2539 6.6250 20.5117 7.1406 20.5821 C 13.5156 21.6133 13.7969 21.7774 14.5703 28.0352 C 14.6172 28.5039 14.9219 28.7852 15.3438 28.7852 Z M 31.2344 54.7305 C 31.8438 54.7305 32.2891 54.2852 32.4062 53.6524 C 34.0703 40.8086 35.8750 38.8633 48.5781 37.4570 C 49.2344 37.3867 49.6797 36.8945 49.6797 36.2852 C 49.6797 35.6758 49.2344 35.2070 48.5781 35.1133 C 35.8750 33.7070 34.0703 31.7617 32.4062 18.9180 C 32.2891 18.2852 31.8438 17.8633 31.2344 17.8633 C 30.6250 17.8633 30.1797 18.2852 30.0860 18.9180 C 28.4219 31.7617 26.5938 33.7070 13.9140 35.1133 C 13.2344 35.2070 12.7891 35.6758 12.7891 36.2852 C 12.7891 36.8945 13.2344 37.3867 13.9140 37.4570 C 26.5703 39.1211 28.3281 40.8321 30.0860 53.6524 C 30.1797 54.2852 30.6250 54.7305 31.2344 54.7305 Z" />
    </svg>
  )
}

function PeopleIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.5,12 C20.5375661,12 23,14.4624339 23,17.5 C23,20.5375661 20.5375661,23 17.5,23 C14.4624339,23 12,20.5375661 12,17.5 C12,14.4624339 14.4624339,12 17.5,12 Z M17.5,13.9992349 L17.4101244,14.0072906 C17.2060313,14.0443345 17.0450996,14.2052662 17.0080557,14.4093593 L17,14.4992349 L16.9996498,16.9992349 L14.4976498,17 L14.4077742,17.0080557 C14.2036811,17.0450996 14.0427494,17.2060313 14.0057055,17.4101244 L13.9976498,17.5 L14.0057055,17.5898756 C14.0427494,17.7939687 14.2036811,17.9549004 14.4077742,17.9919443 L14.4976498,18 L17.0006498,17.9992349 L17.0011076,20.5034847 L17.0091633,20.5933603 C17.0462073,20.7974534 17.207139,20.9583851 17.411232,20.995429 L17.5011076,21.0034847 L17.5909833,20.995429 C17.7950763,20.9583851 17.956008,20.7974534 17.993052,20.5933603 L18.0011076,20.5034847 L18.0006498,17.9992349 L20.5045655,18 L20.5944411,17.9919443 C20.7985342,17.9549004 20.9594659,17.7939687 20.9965098,17.5898756 L21.0045655,17.5 L20.9965098,17.4101244 C20.9594659,17.2060313 20.7985342,17.0450996 20.5944411,17.0080557 L20.5045655,17 L17.9996498,16.9992349 L18,14.4992349 L17.9919443,14.4093593 C17.9549004,14.2052662 17.7939687,14.0443345 17.5898756,14.0072906 L17.5,13.9992349 Z M12.02195,13.9997937 C11.3750475,15.010137 11,16.21127 11,17.5 C11,18.3838153 11.1763947,19.2264314 11.4958991,19.9945634 C8.94205586,19.8573327 7.5,18.7731072 7.5,16.75 L7.5,15.75 C7.5,14.7835017 8.28350169,14 9.25,14 L12.02195,13.9997937 Z M8.12599558,9.0000851 C8.04374524,9.3196794 8,9.65473108 8,10 C8,11.1155313 8.45664565,12.1244073 9.19320511,12.8498962 L9.35525927,13.0009561 L9.25,13 C8.94865366,13 8.65862814,13.0484702 8.38729437,13.1380397 C7.52254738,13.4234998 6.84765465,14.1264102 6.60122004,15.0081669 L6.5667905,15.0090369 C3.6578611,15.0090369 2,13.9192116 2,11.75 L2,10.75 C2,9.8318266 2.70711027,9.07880766 3.60647279,9.0058012 L3.75,9 L8.12599558,9.0000851 Z M12,7 C13.6568542,7 15,8.34314575 15,10 C15,11.6568542 13.6568542,13 12,13 C10.3431458,13 9,11.6568542 9,10 C9,8.34314575 10.3431458,7 12,7 Z M20.25,9 C21.2164983,9 22,9.78350169 22,10.75 L21.9989377,11.7120717 C22.0185903,12.0809152 21.988724,12.4190637 21.9114947,12.7263897 C20.751839,11.6544204 19.2023435,11 17.5,11 C16.9146982,11 16.3474651,11.077361 15.8079678,11.2224158 C15.9331115,10.8382591 16,10.4269409 16,10 C16,9.65473108 15.9562548,9.3196794 15.8740044,9.0000851 L20.25,9 Z M6.5,2 C8.15685425,2 9.5,3.34314575 9.5,5 C9.5,6.65685425 8.15685425,8 6.5,8 C4.84314575,8 3.5,6.65685425 3.5,5 C3.5,3.34314575 4.84314575,2 6.5,2 Z M17.5,2 C19.1568542,2 20.5,3.34314575 20.5,5 C20.5,6.65685425 19.1568542,8 17.5,8 C15.8431458,8 14.5,6.65685425 14.5,5 C14.5,3.34314575 15.8431458,2 17.5,2 Z" />
    </svg>
  )
}

const stats = [
  {
    icon: DiceIcon,
    target: 24,
    suffix: '+',
    label: 'لعبة تعليمية',
    desc: 'تفاعلية وممتعة',
    accent: '#0a0a0a',
  },
  {
    icon: ChildrenIcon,
    target: 1000,
    suffix: '+',
    label: 'طفل مستفيد',
    desc: 'في رحلة التعلم',
    accent: '#0a0a0a',
  },
  {
    icon: StarIcon,
    target: 50,
    suffix: '+',
    label: 'نشاط ثقافي',
    desc: 'يكتشفون التراث',
    accent: '#0a0a0a',
  },
  {
    icon: PeopleIcon,
    target: 15,
    suffix: '',
    label: 'مربي ومعلم',
    desc: 'يساهمون في المحتوى',
    accent: '#0a0a0a',
  },
]

/* ───────────────────────────────────────────────────────────────
   SMOOTH MOUSE PARALLAX HOOK (Water-like effect)
   ───────────────────────────────────────────────────────────────
   Uses lerp interpolation with requestAnimationFrame to create
   a fluid, trailing mouse-tracking tilt effect similar to
   landonorris.com — the "water" feel comes from the spring
   easing that constantly chases the cursor position.
   ─────────────────────────────────────────────────────────────── */

function useSmoothTilt(ref: React.RefObject<HTMLDivElement | null>, intensity = 8) {
  const [isHovered, setIsHovered] = useState(false)
  const targetX = useRef(0)
  const targetY = useRef(0)
  const currentX = useRef(0)
  const currentY = useRef(0)
  const rafId = useRef<number>(0)

  const [transform, setTransform] = useState('perspective(800px) rotateX(0deg) rotateY(0deg)')

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    // Normalize to [-1, 1]
    targetX.current = ((e.clientX - centerX) / (rect.width / 2))
    targetY.current = ((e.clientY - centerY) / (rect.height / 2))
  }, [ref])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    targetX.current = 0
    targetY.current = 0
  }, [])

  useEffect(() => {
    const animate = () => {
      // Lerp toward target — the lower the divisor, the more "water-like" the trail
      const lerpFactor = isHovered ? 0.08 : 0.04
      currentX.current += (targetX.current - currentX.current) * lerpFactor
      currentY.current += (targetY.current - currentY.current) * lerpFactor

      const rotY = currentX.current * intensity
      const rotX = -currentY.current * intensity

      setTransform(
        `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`
      )

      // Stop animation when near zero and not hovered
      if (!isHovered && Math.abs(currentX.current) < 0.001 && Math.abs(currentY.current) < 0.001) {
        currentX.current = 0
        currentY.current = 0
        setTransform('perspective(800px) rotateX(0deg) rotateY(0deg)')
        return
      }

      rafId.current = requestAnimationFrame(animate)
    }

    if (isHovered || Math.abs(currentX.current) > 0.001 || Math.abs(currentY.current) > 0.001) {
      rafId.current = requestAnimationFrame(animate)
    }

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [isHovered, intensity])

  return {
    transform,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  }
}

/* ───────────────────────────────────────────────────────────────
   REUSABLE TILT-WRAPPER for images
   Applies the smooth parallax + a subtle scale boost on hover
   ─────────────────────────────────────────────────────────────── */

function TiltImage({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { transform, handleMouseMove, handleMouseEnter, handleMouseLeave } = useSmoothTilt(ref, 6)

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        willChange: 'transform',
        cursor: 'default',
      }}
    >
      {children}
    </div>
  )
}

function HotAirBalloon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-auto h-full max-h-[260px] ${className}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="بالون هواء ساخن"
    >
      <defs>
        <linearGradient id="balloon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8b94a" />
          <stop offset="50%" stopColor="#d4a030" />
          <stop offset="100%" stopColor="#c49530" />
        </linearGradient>
      </defs>

      {/* Balloon body */}
      <path
        d="M100 20 C55 20 20 70 20 130 C20 180 45 210 60 220 L140 220 C155 210 180 180 180 130 C180 70 145 20 100 20Z"
        fill="url(#balloon)"
        opacity="0.85"
      />

      {/* Balloon stripes */}
      <path d="M100 20 L100 140" stroke="#F7F3EA" strokeWidth="2" opacity="0.4" />
      <path d="M60 40 L70 140" stroke="#F7F3EA" strokeWidth="1.5" opacity="0.3" />
      <path d="M140 40 L130 140" stroke="#F7F3EA" strokeWidth="1.5" opacity="0.3" />

      {/* Balloon highlight */}
      <ellipse cx="80" cy="90" rx="15" ry="30" fill="white" opacity="0.15" />

      {/* Basket */}
      <rect x="75" y="225" width="50" height="20" rx="3" fill="#8B6914" />
      <rect x="75" y="225" width="50" height="4" fill="#6B4914" />

      {/* Ropes */}
      <line x1="80" y1="220" x2="80" y2="228" stroke="#8B6914" strokeWidth="1.5" />
      <line x1="120" y1="220" x2="120" y2="228" stroke="#8B6914" strokeWidth="1.5" />

      {/* Little hearts / stars decoration */}
      <text x="100" y="100" textAnchor="middle" fontSize="18" fill="#F7F3EA" opacity="0.5">ⵣ</text>
    </svg>
  )
}

/* ───────────────────────────────────────────────────────────────
   REUSABLE SECTION COMPONENT (Intersection Observer + Animation)
   ─────────────────────────────────────────────────────────────── */

function AnimatedSection({ children, className = '', delay = 0 }: SectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={sectionRef}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}


/* ───────────────────────────────────────────────────────────────
   HERO SECTION
   ─────────────────────────────────────────────────────────────── */

function HeroSection() {
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      id="hero"
      className="relative overflow-hidden flex items-center "
      style={{
        minHeight: '700px',
        marginTop:"30px"
      }}
    >
      {/* Background fade */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ background: '#F7F3EA' }}
      />

      <div className={`${CONTAINER} ${MAX_W} relative z-10 w-full`}>
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text content */}
          <div className="flex-1 text-center lg:text-right" style={{ maxWidth: '620px' }}>
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 mb-6"
              style={{
                background: '#f0ebe0',
                borderRadius: '999px',
                direction: 'rtl',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            >
              <Sparkles className="w-4 h-4" style={{ color: '#e8b94a' }} />
              <span className="text-sm font-semibold" style={{ color: '#8B6914' }}>
                منصة تعليمية تفاعلية
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="font-bold leading-tight"
              style={{
                fontSize: 'clamp(42px, 5vw, 72px)',
                color: '#0a0a0a',
                letterSpacing: '-2px',
                maxWidth: '620px',
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            >
              تعلّم حروف<br />
              <span style={{ color: '#c49530' }}>تيفيناغ</span> بطريقة<br />
              ممتعة وتفاعلية
            </motion.h1>

            {/* Paragraph */}
            <motion.p
              className="text-base md:text-lg leading-relaxed mt-5"
              style={{
                color: '#5a5a5a',
                maxWidth: '520px',
                marginRight: 'auto',
                marginLeft: 'auto',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.35 }}
              dir="rtl"
            >
              انطلق في مغامرة تعليمية شيقة لاكتشاف جمال اللغة الأمازيغية وحروفها.
              ألعاب تفاعلية، تحديات ممتعة، ومكافآت تحفزك على التعلم.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex items-center gap-4 mt-8 justify-center lg:justify-start"
              dir="rtl"
            >
              <motion.button
                onClick={() => navigate(routes.setup)}
                className="inline-flex items-center gap-2 border-none cursor-pointer font-semibold text-base"
                style={{
                  height: '48px',
                  padding: '0 28px',
                  borderRadius: '999px',
                  background: '#a4d4c5',
                  color: '#0a1a1a',
                  minHeight: '44px',
                }}
                whileHover={{ scale: 1.03, background: '#7ab8a5' }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.45 }}
              >
                ابدأ التعلم مجاناً
                <ArrowLeft className="w-4 h-4" />
              </motion.button>

              <motion.button
                onClick={() => {
                  const el = document.getElementById('testimonials')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-2 border cursor-pointer font-medium text-base"
                style={{
                  height: '48px',
                  padding: '0 28px',
                  borderRadius: '999px',
                  border: '1px solid #d0c8b8',
                  background: 'transparent',
                  color: '#3a3a3a',
                  minHeight: '44px',
                }}
                whileHover={{ scale: 1.03, background: '#f0ebe0' }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.55 }}
              >
                شاهد آراء المستخدمين
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex items-center gap-8 mt-10 justify-center lg:justify-start"
              dir="rtl"
              initial={{ opacity: 0 }}
              animate={loaded ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.65 }}
            >
              {[
                { value: '+1000', label: 'مستخدم' },
                { value: '+50', label: 'لعبة تفاعلية' },
                { value: '4.9', label: 'تقييم المستخدمين' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-xl font-bold" style={{ color: '#0a0a0a' }}>{stat.value}</div>
                  <div className="text-xs" style={{ color: '#8a8a8a' }}>{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Illustration */}
          <motion.div
            className="flex-1 w-full"
            style={{ maxWidth: '560px' }}
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
          >
            <div className="relative" style={{ padding: '48px 24px 64px' }}>
              <TiltImage>
                <img src={imgHomeHero} alt="أسمداس - منصة تعليمية تفاعلية" className="w-full h-auto object-contain min-h-20" />
              </TiltImage>
              {/* Decorative floating elements */}
              <motion.span
                className="absolute text-3xl pointer-events-none"
                style={{ top: '20px', right: '40px' }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                ⵣ
              </motion.span>
              <motion.span
                className="absolute text-2xl pointer-events-none"
                style={{ bottom: '30px', left: '20px' }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                ⵜ
              </motion.span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────────────────────────────────────────────
   HOW IT WORKS — Abstract 3-Step Learning Process
   ───────────────────────────────────────────────────────────────
   Minimal, clean design showing the learning journey in 3 steps
   with Tifinagh symbols as decorative elements.
   ─────────────────────────────────────────────────────────────── */function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const steps = [
    {
      number: '01',
      icon: 'ⵣ',
      title: 'اختر مسارك',
      desc: 'اختر اللعبة أو المسار التعليمي الذي يناسب مستواك واهتمامك. كل مسار يقدم تحديات فريدة تناسب الجميع.',
      reverse: false,
    },
    {
      number: '02',
      icon: 'ⵜ',
      title: 'العب وتعلم',
      desc: 'انغمس في ألعاب تفاعلية شيقة تجمع بين المتعة والفائدة. كل لعبة تعزز فهمك للحروف والمفردات الأمازيغية.',
      reverse: true,
    },
    {
      number: '03',
      icon: 'ⵓ',
      title: 'تتبع تقدمك',
      desc: 'راقب تطور مستواك من خلال إحصائيات دقيقة وتحفيزات مستمرة. احتفل بإنجازاتك مع كل خطوة تتقدم فيها.',
      reverse: false,
    },
  ]

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 md:py-28"
      style={{ background: 'inherit' }}
    >
      <div className="mx-auto px-8 md:px-16 max-w-[1140px] relative z-10">
        {/* ── Section Header ── */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          dir="rtl"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-4"
            style={{ background: '#f0ebe0', borderRadius: '999px' }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: '#c49530' }} />
            <span className="text-xs font-semibold" style={{ color: '#8B6914' }}>طريقة العمل</span>
          </div>
          <h2 className="font-bold text-3xl md:text-4xl mb-3" style={{ color: '#0a0a0a' }}>
            كيف تبدأ رحلتك في <span style={{ color: '#c49530' }}>3</span> خطوات
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: '#5a5a5a' }}>
            رحلة تعلم ممتعة تبدأ بخطوة
          </p>
          {/* Gold underline with decorative wings — inspired by the spec */}
          <motion.div
            className="mx-auto mt-6 flex items-center gap-1"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={inView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            style={{ width: 'fit-content' }}
          >
            {/* Left wing */}
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M8 0 L0 4 L8 8" stroke="#c49530" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {/* Center bar */}
            <div style={{ width: '60px', height: '3px', background: '#c49530' }} />
            {/* Right wing */}
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M0 0 L8 4 L0 8" stroke="#c49530" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </motion.div>

        {/* ── Timeline Container ── */}
        <div className="relative max-w-[900px] mx-auto">
          {/* Vertical dotted line — desktop: centered */}
          <div
            className="hidden md:block absolute top-0 bottom-0"
            style={{
              left: '50%',
              borderLeft: '2px dotted #d0c8b8',
              transform: 'translateX(-50%)',
            }}
          />
          {/* Vertical dotted line — mobile: left side (aligns with timeline circle in RTL) */}
          <div
            className="md:hidden absolute top-0 bottom-0"
            style={{
              left: '24px',
              borderLeft: '2px dotted #d0c8b8',
            }}
          />

          {(() => {
            const renderText = (title: string, desc: string, delay: number) => (
              <motion.div
                className="text-right"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: '#8a8a8a' }}
                >
                  الخطوة
                </span>
                <h3
                  className="text-xl font-bold mt-1 mb-3"
                  style={{ color: '#c49530' }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#5a5a5a' }}>
                  {desc}
                </p>
              </motion.div>
            )

            const renderCircle = (icon: string, delay: number) => (
              <motion.div
                className="flex items-center justify-center"
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: '#c49530',
                  color: '#ffffff',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{
                  type: 'spring',
                  stiffness: 120,
                  damping: 14,
                  delay,
                }}
              >
                <span className="text-5xl font-bold">{icon}</span>
              </motion.div>
            )

            const renderStepCircle = (number: string, delay: number) => (
              <motion.div
                className="flex items-center justify-center"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '2px solid #d0c8b8',
                  color: '#0a0a0a',
                }}
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{
                  type: 'spring',
                  stiffness: 160,
                  damping: 16,
                  delay,
                }}
                whileHover={{ scale: 1.08, borderColor: '#c49530' }}
              >
                <span className="text-sm font-bold">{number}</span>
              </motion.div>
            )

            return steps.map((step, idx) => {
              const textDelay = 0.2 + idx * 0.25
              const circleDelay = 0.2 + idx * 0.25
              const stepDelay = 0.1 + idx * 0.25

              return (
                <div
                  key={idx}
                  className="relative mb-16 md:mb-20 last:mb-0"
                  style={{ direction: 'rtl' }}
                >
                  {/* ── Desktop: alternating 3-column layout ── */}
                  <div className="hidden md:flex items-center">
                    <div className="w-[calc(50%-40px)]">
                      {!step.reverse
                        ? renderText(step.title, step.desc, textDelay)
                        : <div className="flex justify-center">{renderCircle(step.icon, circleDelay)}</div>
                      }
                    </div>
                    <div className="flex-shrink-0 relative z-10 mx-5 flex justify-center" style={{ width: '50px' }}>
                      {renderStepCircle(step.number, stepDelay)}
                    </div>
                    <div className="w-[calc(50%-40px)]">
                      {!step.reverse
                        ? <div className="flex justify-center">{renderCircle(step.icon, circleDelay)}</div>
                        : renderText(step.title, step.desc, textDelay)
                      }
                    </div>
                  </div>

                  {/* ── Mobile: stacked content + timeline circle on right ── */}
                  <div className="flex md:hidden items-start gap-3">
                    <div className="flex-1 min-w-0">
                      {renderText(step.title, step.desc, textDelay)}
                      <div className="mt-6 flex justify-center">
                        {renderCircle(step.icon, circleDelay)}
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex justify-center z-10" style={{ width: '44px' }}>
                      {renderStepCircle(step.number, stepDelay)}
                    </div>
                  </div>
                </div>
              )
            })
          })()}
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div
          className="text-center mt-12 md:mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <motion.button
            onClick={() => navigate(routes.setup)}
            className="inline-flex items-center gap-2 border-none cursor-pointer font-semibold"
            style={{
              height: '48px',
              padding: '0 28px',
              borderRadius: '3px',
              background: '#0a0a0a',
              color: '#ffffff',
              minHeight: '44px',
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            ابدأ الرحلة الآن
            <ArrowLeft className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

/* ───────────────────────────────────────────────────────────────
   VIDEO SECTION
   ─────────────────────────────────────────────────────────────── */

function VideoSection() {
  const [playing, setPlaying] = useState(false)

  return (
    <section id="about" className={SECTIONS_TOP_BOTTOM}>
      <div className={`${CONTAINER} ${MAX_W}`}>
        <AnimatedSection>
          <div
            className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
            style={{
              padding: '64px',
              borderRadius: '24px',
              background: '#f5f0e5',
              direction: 'rtl',
            }}
          >
            {/* Text */}
            <div className="lg:w-5/12">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 mb-4"
                style={{ background: '#ebe6d6', borderRadius: '999px' }}
              >
                <Play className="w-3.5 h-3.5" style={{ color: '#8B6914' }} />
                <span className="text-xs font-semibold" style={{ color: '#8B6914' }}>شاهد الفيديو</span>
              </motion.div>
              <h2 className="font-bold text-3xl md:text-4xl mb-4" style={{ color: '#0a0a0a' }}>
                كيف يعمل <span style={{ color: '#c49530' }}>أسمداس</span>؟
              </h2>
              <p className="text-base leading-relaxed" style={{ color: '#5a5a5a' }}>
                فيديو قصير يشرح كيفية استخدام المنصة، من التسجيل إلى أول لعبة.
                اكتشف كيف يمكن لأطفالك تعلم حروف تيفيناغ في دقائق.
              </p>
            </div>

            {/* Video placeholder */}
            <div className="lg:w-7/12">
              <motion.div
                className="relative overflow-hidden cursor-pointer"
                style={{
                  aspectRatio: '16/9',
                  borderRadius: '16px',
                  background: '#e0d8c8',
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                onClick={() => setPlaying(true)}
              >
                {playing ? (
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/YFbbeJZlYXk?si=_OwQdV0oHUgUluFo"
                   title="YouTube video player" 
                  frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                   referrerPolicy="strict-origin-when-cross-origin" allowFullScreen>

                  </iframe>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="flex items-center justify-center"
                      style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '999px',
                        background: 'rgba(247, 243, 234, 0.9)',
                      }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Play className="w-8 h-8" style={{ color: '#0a0a0a', marginRight: '2px' }} />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

/* ───────────────────────────────────────────────────────────────
   TESTIMONIALS CAROUSEL
   ─────────────────────────────────────────────────────────────── */

// function TestimonialsSection() {
//   const [activeIdx, setActiveIdx] = useState(1)
//   const isMobile = useIsMobile()

//   // Responsive card dimensions — init with desktop default, re-compute once mounted
//   const cardWidth = isMobile ? '85vw' : '320px'
//   const cardHeight = isMobile ? '360px' : '380px'
//   const cardPadding = isMobile ? '20px' : '32px'
//   const cardGap = isMobile ? 12 : 32
//   const numericWidth = typeof window !== 'undefined'
//     ? (isMobile ? Math.min(window.innerWidth * 0.85, 320) : 320)
//     : 320

//   const prev = () => setActiveIdx((i) => (i - 1 + testimonials.length) % testimonials.length)
//   const next = () => setActiveIdx((i) => (i + 1) % testimonials.length)

//   const getCardTransform = (idx: number) => {
//     const diff = (idx - activeIdx + testimonials.length) % testimonials.length
//     const normalized = diff > 2 ? diff - testimonials.length : diff
//     return normalized
//   }

//   return (
//     <section id="testimonials" className={SECTIONS_TOP_BOTTOM}>
//       <div className={`${CONTAINER} ${MAX_W}`}>
//         {/* <AnimatedSection>

        
//         </AnimatedSection> */}
//       </div>
//     </section>
//   )
// }

/* ───────────────────────────────────────────────────────────────
   FIVE PATHWAYS SECTION (Alternating)
   ─────────────────────────────────────────────────────────────── */

function PathwaysSection() {
  return (
    <section id="pathways" className={SECTIONS_TOP_BOTTOM}>
      <div className={`${CONTAINER} ${MAX_W}`}>
        <AnimatedSection>
          <div className="text-center mb-16" dir="rtl">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-4"
              style={{ background: '#f0ebe0', borderRadius: '999px' }}
            >
              <BookOpen className="w-3.5 h-3.5" style={{ color: '#b8a4ed' }} />
              <span className="text-xs font-semibold" style={{ color: '#8B6914' }}>مسارات التعلم</span>
            </motion.div>
            <h2 className="font-bold text-3xl md:text-4xl mb-3" style={{ color: '#0a0a0a' }}>
              اختر مسار تعلمك
            </h2>
            <p className="text-base max-w-lg mx-auto" style={{ color: '#5a5a5a' }}>
              خمس مسارات تفاعلية تناسب جميع المستويات والأعمار
            </p>
          </div>
        </AnimatedSection>

        {pathways.map((block, idx) => {
          const isLeft = idx % 2 === 0

          return (
            <AnimatedSection key={block.id} delay={idx * 0.1}>
              <div
                className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 mb-[120px] last:mb-0"
                style={{ direction: 'rtl' }}
              >
                {/* Image */}
                <div className={`w-full lg:w-5/12 ${isLeft ? 'lg:order-2' : 'lg:order-1'}`}>
                  <motion.div
                    className="relative"
                    style={{ padding: '40px' }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TiltImage>
                      <img
                        src={block.image}
                        alt={block.alt}
                        className="w-full h-auto object-contain"
                        style={{ maxHeight: '360px' }}
                      />
                    </TiltImage>
                  </motion.div>
                </div>

                {/* Text */}
                <div className={`w-full lg:w-7/12 ${isLeft ? 'lg:order-1' : 'lg:order-2'}`}>
                  <span
                    className="inline-block text-xs font-semibold px-3 py-1 mb-3"
                    style={{
                      background: '#f0ebe0',
                      borderRadius: '999px',
                      color: '#8B6914',
                    }}
                  >
                    المسار {idx + 1}
                  </span>
                  <h3 className="font-bold text-2xl md:text-3xl mb-1" style={{ color: '#0a0a0a' }}>
                    {block.title}
                  </h3>
                  <p className="tifinagh-text text-sm mb-4" style={{ color: '#c49530' }}>
                    {block.subtitle}
                  </p>
                  <p className="text-base leading-relaxed mb-6" style={{ color: '#5a5a5a' }}>
                    {block.body}
                  </p>

                  {/* Features */}
                  <div className="flex flex-col gap-2">
                    {block.features.map((feat, fi) => (
                      <div key={fi} className="flex items-center gap-2.5">
                        <CheckCircle className="w-4 h-4 shrink-0" style={{ color: '#a4d4c5' }} />
                        <span className="text-sm" style={{ color: '#3a3a3a' }}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          )
        })}
      </div>
    </section>
  )
}

/* ───────────────────────────────────────────────────────────────
   CTA BANNER (Hot Air Balloon)
   ─────────────────────────────────────────────────────────────── */

function CTABanner() {
  const navigate = useNavigate()

  return (
    <section className={SECTIONS_TOP_BOTTOM}>
      <div className={`${CONTAINER} ${MAX_W}`}>
        <AnimatedSection>
          <motion.div
            className="relative overflow-hidden flex items-center"
            style={{
              minHeight: '340px',
              borderRadius: '28px',
              padding: '64px',
              background: 'linear-gradient(135deg, #f5f0e5 0%, #ede5d5 100%)',
              direction: 'rtl',
            }}
            whileHover={{ boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}
            transition={{ duration: 0.3 }}
          >
            {/* Text: 60% */}
            <div className="relative z-10 w-full lg:w-3/5">
              <h2 className="font-bold text-3xl md:text-4xl mb-4" style={{ color: '#0a0a0a' }}>
                استعد للانطلاق في <span style={{ color: '#c49530' }}>المغامرة</span>
              </h2>
              <p className="text-base leading-relaxed mb-6 max-w-md" style={{ color: '#5a5a5a' }}>
                انضم إلى آلاف المستخدمين الذين اكتشفوا جمال اللغة الأمازيغية من خلال منصتنا التفاعلية.
                ابدأ رحلتك اليوم!
              </p>
              <motion.button
                onClick={() => navigate(routes.setup)}
                className="inline-flex items-center gap-2 border-none cursor-pointer font-semibold"
                style={{
                  height: '48px',
                  padding: '0 28px',
                  borderRadius: '999px',
                  background: '#a4d4c5',
                  color: '#0a1a1a',
                  minHeight: '44px',
                }}
                whileHover={{ scale: 1.03, background: '#7ab8a5' }}
                whileTap={{ scale: 0.97 }}
              >
                ابدأ الآن مجاناً
                <ArrowLeft className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Balloon: 40% */}
            <div className="hidden lg:flex items-center justify-center w-2/5 relative">
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <HotAirBalloon />
              </motion.div>
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  )
}

/* ───────────────────────────────────────────────────────────────
   FEATURE CARDS (2 × 2)
   ─────────────────────────────────────────────────────────────── */

function FeatureCardsSection() {
  return (
    <section id="features" className={SECTIONS_TOP_BOTTOM}>
      <div className={`${CONTAINER} ${MAX_W}`}>
        <AnimatedSection>
          <div className="text-center mb-12" dir="rtl">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-4"
              style={{ background: '#f0ebe0', borderRadius: '999px' }}
            >
              <Star className="w-3.5 h-3.5" style={{ color: '#e8b94a' }} />
              <span className="text-xs font-semibold" style={{ color: '#8B6914' }}>المميزات</span>
            </motion.div>
            <h2 className="font-bold text-3xl md:text-4xl mb-3" style={{ color: '#0a0a0a' }}>
              لماذا تختار <span style={{ color: '#c49530' }}>أسمداس</span>؟
            </h2>
            <p className="text-base max-w-lg mx-auto" style={{ color: '#5a5a5a' }}>
              كل ما تحتاجه لتعلم الأمازيغية في مكان واحد
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {featureCards.map((card, idx) => (
              <motion.div
                key={idx}
                className="transition-all duration-250 cursor-default"
                style={{
                  padding: '32px',
                  borderRadius: '20px',
                  background: '#ffffff',
                  border: '1px solid #eee',
                  direction: 'rtl',
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.12, duration: 0.5 }}
                whileHover={{
                  y: -8,
                  boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
                }}
              >
                <motion.div
                  className="flex items-center justify-center w-14 h-14 rounded-xl mb-4"
                  style={{ background: `${card.accent}20`, color: card.accent }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {card.icon}
                </motion.div>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#0a0a0a' }}>{card.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#5a5a5a' }}>{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

/* ───────────────────────────────────────────────────────────────
   INSIGHTS SECTION (Editorial / Newspaper Layout)
   ─────────────────────────────────────────────────────────────── */

function InsightsSection() {
  return (
    <section className={SECTIONS_TOP_BOTTOM}>
      <div className={`${CONTAINER} ${MAX_W}`}>
        <AnimatedSection>
          <div className="text-center mb-12" dir="rtl">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-4"
              style={{ background: '#f0ebe0', borderRadius: '999px' }}
            >
              <Target className="w-3.5 h-3.5" style={{ color: '#c49530' }} />
              <span className="text-xs font-semibold" style={{ color: '#8B6914' }}>مدونة</span>
            </motion.div>
            <h2 className="font-bold text-3xl md:text-4xl mb-3" style={{ color: '#0a0a0a' }}>
              أحدث المقالات
            </h2>
            <p className="text-base max-w-lg mx-auto" style={{ color: '#5a5a5a' }}>
              مواضيع ومقالات عن تعليم الأمازيغية والثقافة
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Featured article — spans 2 cols */}
            <motion.div
              className="lg:col-span-2 overflow-hidden cursor-pointer group"
              style={{
                borderRadius: '16px',
                background: '#ffffff',
                border: '1px solid #eee',
                direction: 'rtl',
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="overflow-hidden">
                <motion.img
                  src={insightsArticles[0].image}
                  alt={insightsArticles[0].title}
                  className="w-full h-56 md:h-72 object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="p-6 md:p-8">
                <span
                  className="inline-block text-xs font-semibold px-3 py-1 mb-3"
                  style={{ background: '#f0ebe0', borderRadius: '999px', color: '#8B6914' }}
                >
                  {insightsArticles[0].category}
                </span>
                <h3 className="font-bold text-xl md:text-2xl mb-3" style={{ color: '#0a0a0a' }}>
                  {insightsArticles[0].title}
                </h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#5a5a5a' }}>
                  {insightsArticles[0].excerpt}
                </p>
                <div className="flex items-center gap-3 text-xs" style={{ color: '#8a8a8a' }}>
                  <span>{insightsArticles[0].author}</span>
                  <span>•</span>
                  <span>{insightsArticles[0].date}</span>
                </div>
              </div>
            </motion.div>

            {/* Smaller cards */}
            <div className="flex flex-col gap-6">
              {insightsArticles.slice(1).map((article, idx) => (
                <motion.div
                  key={idx}
                  className="overflow-hidden cursor-pointer group"
                  style={{
                    borderRadius: '16px',
                    background: '#ffffff',
                    border: '1px solid #eee',
                    direction: 'rtl',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                >
                  <div className="p-5">
                    <span
                      className="inline-block text-xs font-semibold px-2.5 py-0.5 mb-2"
                      style={{ background: '#f0ebe0', borderRadius: '999px', color: '#8B6914' }}
                    >
                      {article.category}
                    </span>
                    <h4 className="font-bold text-sm mb-2" style={{ color: '#0a0a0a' }}>
                      {article.title}
                    </h4>
                    <p className="text-xs leading-relaxed mb-3" style={{ color: '#5a5a5a' }}>
                      {article.excerpt}
                    </p>
                    <span className="text-xs" style={{ color: '#8a8a8a' }}>{article.date}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

/* ───────────────────────────────────────────────────────────────
   CONTACT FORM
   ─────────────────────────────────────────────────────────────── */

function ContactSection() {
  const navigate = useNavigate()

  return (
    <section id="contact" className={SECTIONS_TOP_BOTTOM}>
      <div className={`${CONTAINER} ${MAX_W}`}>
        <AnimatedSection>
          <div className="grid md:grid-cols-2 gap-12 items-start" style={{ direction: 'rtl' }}>
            {/* Left: Text */}
            <div>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 mb-4"
                style={{ background: '#f0ebe0', borderRadius: '999px' }}
              >
                <Mail className="w-3.5 h-3.5" style={{ color: '#b8a4ed' }} />
                <span className="text-xs font-semibold" style={{ color: '#8B6914' }}>تواصل معنا</span>
              </motion.div>
              <h2 className="font-bold text-3xl md:text-4xl mb-4" style={{ color: '#0a0a0a' }}>
                لديك سؤال؟ <br />
                <span style={{ color: '#c49530' }}>نحن هنا لمساعدتك</span>
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: '#5a5a5a' }}>
                يسعدنا التواصل معك! سواء كان لديك استفسار، اقتراح، أو فكرة للتعاون،
                فلا تتردد في مراسلتنا.
              </p>

              {/* Contact info */}
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 flex items-center justify-center shrink-0"
                    style={{ background: '#f0ebe0', borderRadius: '12px' }}
                  >
                    <Mail className="w-4 h-4" style={{ color: '#c49530' }} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: '#8a8a8a' }}>البريد الإلكتروني</div>
                    <div className="text-sm" style={{ color: '#0a0a0a' }}>hello@aslmad.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 flex items-center justify-center shrink-0"
                    style={{ background: '#f0ebe0', borderRadius: '12px' }}
                  >
                    <MapPin className="w-4 h-4" style={{ color: '#c49530' }} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: '#8a8a8a' }}>الموقع</div>
                    <div className="text-sm" style={{ color: '#0a0a0a' }}>المغرب — في قلب الأطلس</div>
                  </div>
                </div>
              </div>

              {/* Quick CTA */}
              <motion.button
                onClick={() => navigate(routes.setup)}
                className="inline-flex items-center gap-2 border-none cursor-pointer font-semibold"
                style={{
                  height: '48px',
                  padding: '0 24px',
                  borderRadius: '999px',
                  background: '#a4d4c5',
                  color: '#0a1a1a',
                  minHeight: '44px',
                }}
                whileHover={{ scale: 1.03, background: '#7ab8a5' }}
                whileTap={{ scale: 0.97 }}
              >
                ابدأ التعلم الآن
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Right: Form */}
            <motion.form
              className="flex flex-col gap-5"
              style={{
                padding: '40px',
                borderRadius: '24px',
                background: '#ffffff',
                border: '1px solid #eee',
              }}
              onSubmit={(e) => e.preventDefault()}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#3a3a3a' }}>الاسم</label>
                  <input
                    type="text"
                    placeholder="اسمك الكريم"
                    className="w-full px-4 border outline-none transition-all duration-200"
                    style={{
                      height: '48px',
                      borderRadius: '12px',
                      borderColor: '#ddd',
                      background: '#F7F3EA',
                      color: '#0a0a0a',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#a4d4c5'; e.target.style.boxShadow = '0 0 0 3px rgba(164,212,197,0.2)' }}
                    onBlur={(e) => { e.target.style.borderColor = '#ddd'; e.target.style.boxShadow = 'none' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#3a3a3a' }}>البريد</label>
                  <input
                    type="email"
                    placeholder="بريدك@example.com"
                    className="w-full px-4 border outline-none transition-all duration-200"
                    style={{
                      height: '48px',
                      borderRadius: '12px',
                      borderColor: '#ddd',
                      background: '#F7F3EA',
                      color: '#0a0a0a',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#a4d4c5'; e.target.style.boxShadow = '0 0 0 3px rgba(164,212,197,0.2)' }}
                    onBlur={(e) => { e.target.style.borderColor = '#ddd'; e.target.style.boxShadow = 'none' }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#3a3a3a' }}>الموضوع</label>
                <input
                  type="text"
                  placeholder="عنوان رسالتك"
                  className="w-full px-4 border outline-none transition-all duration-200"
                  style={{
                    height: '48px',
                    borderRadius: '12px',
                    borderColor: '#ddd',
                    background: '#F7F3EA',
                    color: '#0a0a0a',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#a4d4c5'; e.target.style.boxShadow = '0 0 0 3px rgba(164,212,197,0.2)' }}
                  onBlur={(e) => { e.target.style.borderColor = '#ddd'; e.target.style.boxShadow = 'none' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#3a3a3a' }}>الرسالة</label>
                <textarea
                  rows={4}
                  placeholder="اكتب رسالتك هنا..."
                  className="w-full px-4 py-3 border outline-none transition-all duration-200 resize-none"
                  style={{
                    borderRadius: '12px',
                    borderColor: '#ddd',
                    background: '#F7F3EA',
                    color: '#0a0a0a',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#a4d4c5'; e.target.style.boxShadow = '0 0 0 3px rgba(164,212,197,0.2)' }}
                  onBlur={(e) => { e.target.style.borderColor = '#ddd'; e.target.style.boxShadow = 'none' }}
                />
              </div>

            
              <motion.button
                type="submit"
                className="inline-flex items-center justify-center gap-2 border-none cursor-pointer font-semibold"
                style={{
                  height: '48px',
                  borderRadius: '999px',
                  background: '#a4d4c5',
                  color: '#0a1a1a',
                  minHeight: '44px',
                }}
                whileHover={{ scale: 1.02, background: '#7ab8a5' }}
                whileTap={{ scale: 0.98 }}
              >
                <Send className="w-4 h-4" />
                إرسال الرسالة
              </motion.button>
            </motion.form>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

/* ───────────────────────────────────────────────────────────────
   MAIN LANDING VIEW
   ─────────────────────────────────────────────────────────────── */

export default function LandingView() {
  return (
    <div className="w-full" style={{ background: '#F7F3EA', fontFamily: "'El Messiri', Inter, sans-serif" }}>
      <HeroSection />

      {/* ── Stats Section (animated counters with SVGs) ── */}
      <section className="py-16 md:py-20">
        <div className={`${CONTAINER} ${MAX_W}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div
                  className="group relative rounded-2xl px-5 py-6 md:py-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.5)',
                    border: '1px solid var(--clay-hairline)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  {/* Accent bar on top */}
                  <div
                    className="absolute top-0 left-0 right-0 rounded-t-2xl transition-all duration-300 "
                    style={{ background: stat.accent }}
                  />

                  {/* Animated icon container */}
                  <motion.div
                    className="w-12 h-12 flex items-center justify-center rounded-[5px] mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{
                      background: `color-mix(in srgb, ${stat.accent} 15%, transparent)`,
                      color: stat.accent,
                    }}
                    whileInView={{ scale: [0.8, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 + 0.15 }}
                  >
                    <stat.icon className="w-6 h-6" />
                  </motion.div>

                  {/* Animated counter */}
                  <div
                    className="text-2xl md:text-3xl font-bold mb-0.5"
                    style={{ color: 'var(--clay-ink)' }}
                  >
                    <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                  </div>

                  {/* Label */}
                  <div
                    className="text-sm font-semibold mb-0.5"
                    style={{ color: 'var(--clay-body)' }}
                  >
                    {stat.label}
                  </div>

                  {/* Description */}
                  <div
                    className="text-xs"
                    style={{ color: 'var(--clay-muted-soft)' }}
                  >
                    {stat.desc}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <HowItWorksSection />
      <VideoSection />
      {/* <TestimonialsSection /> */}
      <PathwaysSection />
      <CTABanner />
      <FeatureCardsSection />
      <InsightsSection />
      <ContactSection />
    </div>
  )
}
