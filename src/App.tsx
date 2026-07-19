import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, MotionValue, useScroll, useTransform } from 'framer-motion'
import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { SplineSceneBasic } from '@/components/ui/demo'

type FadeInProps<T extends ElementType = 'div'> = {
  as?: T
  delay?: number
  duration?: number
  x?: number
  y?: number
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children'>

function FadeIn<T extends ElementType = 'div'>({
  as,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  children,
  ...rest
}: FadeInProps<T>) {
  const tag = as ?? 'div'
  const MotionComponent = useMemo(() => motion.create(tag), [tag])

  return (
    <MotionComponent
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
      {...rest}
    >
      {children}
    </MotionComponent>
  )
}

function ContactButton() {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-xs font-medium uppercase tracking-[0.24em] text-white sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base"
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), inset 4px 4px 12px #7721B1',
        outline: '2px solid #fff',
        outlineOffset: '-3px',
      }}
    >
      Contact Me
      <ArrowUpRight size={16} strokeWidth={2.2} />
    </button>
  )
}

function LiveProjectButton() {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full border-2 border-[#D7E2EA] px-8 py-3 text-sm font-medium uppercase tracking-[0.24em] text-[#D7E2EA] transition-colors duration-200 hover:bg-[#D7E2EA]/10 sm:px-10 sm:py-3.5 sm:text-base"
    >
      Live Project
      <ArrowUpRight size={16} strokeWidth={2.2} />
    </button>
  )
}

type AnimatedCharProps = {
  char: string
  index: number
  total: number
  progress: ReturnType<typeof useScroll>['scrollYProgress']
}

function AnimatedChar({ char, index, total, progress }: AnimatedCharProps) {
  const start = index / total
  const end = (index + 1) / total
  const opacity = useTransform(progress, [start, end], [0.2, 1])
  const content = char === ' ' ? '\u00A0' : char

  return (
    <span className="relative inline-block">
      <span className="invisible">{content}</span>
      <motion.span className="absolute inset-0" style={{ opacity }}>
        {content}
      </motion.span>
    </span>
  )
}

function AnimatedWord({
  word,
  index,
  total,
  progress,
}: {
  word: string
  index: number
  total: number
  progress: MotionValue<number>
}) {
  const start = index / total
  const end = (index + 1) / total

  const opacity = useTransform(progress, [start, end], [0.25, 1])

  return (
    <motion.span style={{ opacity }} className="inline-block">
      {word}{'\u00A0'}
    </motion.span>
  )
}

function AnimatedText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  })

  // Split into paragraphs (so \n\n still creates a visual break),
  // then flatten to words while keeping a global running index
  // so the fade progresses smoothly across the whole block.
  const paragraphs = text.split('\n\n').map((p) => p.split(/\s+/).filter(Boolean))
  const totalWords = paragraphs.reduce((sum, p) => sum + p.length, 0)

  let wordIndex = 0

  return (
    <div
      ref={ref}
      className="mx-auto max-w-[560px] text-center text-[clamp(1rem,2vw,1.35rem)] font-medium leading-relaxed text-[#D7E2EA]"
    >
      {paragraphs.map((words, pIndex) => (
        <p key={pIndex} className={pIndex > 0 ? 'mt-4' : ''}>
          {words.map((word, i) => {
            const currentIndex = wordIndex
            wordIndex += 1
            return (
              <AnimatedWord
                key={`${word}-${pIndex}-${i}`}
                word={word}
                index={currentIndex}
                total={totalWords}
                progress={scrollYProgress}
              />
            )
          })}
        </p>
      ))}
    </div>
  )
}

function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col overflow-x-clip bg-[#0C0C0C] px-4 pb-8" id="home">
      <FadeIn as="nav" delay={0} y={-20} className="px-6 pt-6 md:px-10 md:pt-8">
        <ul className="flex items-center justify-between text-sm font-medium uppercase tracking-wider text-[#D7E2EA] md:text-lg lg:text-[1.4rem]">
          <li>
            <a className="transition-opacity duration-200 hover:opacity-70" href="#about">
              About
            </a>
          </li>
          <li>
            <a className="transition-opacity duration-200 hover:opacity-70" href="#resume">
              Resume
            </a>
          </li>
          <li>
            <a className="transition-opacity duration-200 hover:opacity-70" href="#projects">
              Projects
            </a>
          </li>
          <li>
            <a className="transition-opacity duration-200 hover:opacity-70" href="#contact">
              Contact
            </a>
          </li>
        </ul>
      </FadeIn>

      <div className="mx-auto mt-8 flex w-full max-w-[1400px] flex-1 items-center px-2 sm:mt-10 sm:px-6 md:px-10">
        <FadeIn delay={0.15} y={30} className="w-full">
          <SplineSceneBasic />
        </FadeIn>
      </div>
    </section>
  )
}

type TechLogo = {
  name: string
  icon: string
}

const techLogos: TechLogo[] = [
  { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
  { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
  { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
  { name: 'IntelliJ IDEA', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg' },
  { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
  { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
  { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
]

function MarqueeRow({ logos, translate }: { logos: TechLogo[]; translate: string }) {
  return (
    <div
      className="flex w-max gap-4"
      style={{
        transform: translate,
        willChange: 'transform',
      }}
    >
      {logos.map((logo, index) => (
        <div
          key={`${logo.name}-${index}`}
          className="flex h-[130px] w-[130px] flex-col items-center justify-center gap-3 rounded-2xl border border-[#D7E2EA]/15 bg-white/5 p-4"
        >
          <img
            src={logo.icon}
            alt={logo.name}
            width={56}
            height={56}
            loading="lazy"
            className="h-14 w-14 object-contain"
          />
          <span className="text-center text-[11px] font-medium uppercase tracking-wide text-[#D7E2EA]/70">
            {logo.name}
          </span>
        </div>
      ))}
    </div>
  )
}

function MarqueeSection() {
  const ref = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const node = ref.current
      if (!node) {
        return
      }
      const sectionTop = node.offsetTop
      const value = (window.scrollY - sectionTop + window.innerHeight) * 0.3
      setOffset(value)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const row1 = techLogos.slice(0, 10)
  const row2 = techLogos.slice(10)
  const tripledRow1 = [...row1, ...row1, ...row1]
  const tripledRow2 = [...row2, ...row2, ...row2]
  const x1 = `translateX(${offset - 200}px)`  
  const x2 = `translateX(${-1 * (offset - 200)}px)`

  return (
    <section ref={ref} className="bg-[#0C0C0C] px-4 pb-10 pt-24 sm:pt-32 md:pt-40">
      <div className="flex flex-col gap-3 overflow-hidden">
        <MarqueeRow logos={tripledRow1} translate={x1} />
        <MarqueeRow logos={tripledRow2} translate={x2} />
      </div>
    </section>
  )
}

function AboutSection() {
  const paragraph =
    "I'm a Software Engineer who loves transforming ideas into meaningful digital experiences." +
    "I enjoy building applications, experimenting with new technologies, and continuously learning to become a better developer." +
    "With a passion for problem-solving and software development, I focus on creating solutions that are not only functional but also intuitive and enjoyable to use. When I'm not coding, you can find me exploring new technologies, reading tech content, or traveling to discover new experiences."

  return (
    <section
      id="about"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0C0C0C] px-5 py-20 sm:px-8 md:px-10"
    >
      <FadeIn
        delay={0.1}
        duration={0.9}
        x={-80}
        y={0}
        className="pointer-events-none absolute left-[1%] top-[4%] w-[120px] sm:left-[2%] sm:w-[160px] md:left-[4%] md:w-[210px]"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
          alt=""
          loading="lazy"
          className="w-full"
        />
      </FadeIn>
      <FadeIn
        delay={0.25}
        duration={0.9}
        x={-80}
        y={0}
        className="pointer-events-none absolute bottom-[8%] left-[3%] w-[100px] sm:left-[6%] sm:w-[140px] md:left-[10%] md:w-[180px]"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
          alt=""
          loading="lazy"
          className="w-full"
        />
      </FadeIn>
      <FadeIn
        delay={0.15}
        duration={0.9}
        x={80}
        y={0}
        className="pointer-events-none absolute right-[1%] top-[4%] w-[120px] sm:right-[2%] sm:w-[160px] md:right-[4%] md:w-[210px]"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
          alt=""
          loading="lazy"
          className="w-full"
        />
      </FadeIn>
      <FadeIn
        delay={0.3}
        duration={0.9}
        x={80}
        y={0}
        className="pointer-events-none absolute bottom-[8%] right-[3%] w-[130px] sm:right-[6%] sm:w-[170px] md:right-[10%] md:w-[220px]"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
          alt=""
          loading="lazy"
          className="w-full"
        />
      </FadeIn>

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-10 sm:gap-14 md:gap-16">
        <FadeIn as="h2" delay={0} y={40} className="hero-heading text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-tight">
          About me
        </FadeIn>
        <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24" id="contact">
          <AnimatedText text={paragraph} />
          <ContactButton />
        </div>
      </div>
    </section>
  )
}

type EducationItem = {
  title: string
  subtitle: string
  period: string
  detail: string
}

type ExperienceItem = {
  title: string
  subtitle: string
  period?: string
  detail?: string
}

type LanguageItem = {
  language: string
  level: string
}

type ResumeSection =
  | { number: string; name: string; type: 'education'; items: EducationItem[] }
  | { number: string; name: string; type: 'experience'; items: ExperienceItem[] }
  | { number: string; name: string; type: 'tags'; items: string[] }
  | { number: string; name: string; type: 'languages'; items: LanguageItem[] }

const resumeData: ResumeSection[] = [
  {
    number: '01',
    name: 'Education',
    type: 'education',
    items: [
      {
        title: 'Bachelor of Software Engineering',
        subtitle: 'Tunku Abdul Rahman University of Management & Technology (TARUMT)',
        period: '2023 - 2025',
        detail: 'CGPA: 3.73',
      },
      {
        title: 'Diploma in Computer Science',
        subtitle: 'Tunku Abdul Rahman University of Management & Technology (TARUMT)',
        period: '2021 - 2023',
        detail: 'CGPA: 3.57',
      },
    ],
  },
  {
    number: '02',
    name: 'Work Experience',
    type: 'experience',
    items: [
      { title: 'Software Tester (Intern)', subtitle: '81GROUP Sdn Bhd' },
      { title: 'Content Writer & Graphic Designer (Part Time)', subtitle: 'QC Fixer Solutions' },
      { title: 'Software Engineer (Intern)', subtitle: 'Theta Service Partner Sdn Bhd' },
      { title: 'Software Engineer (Permanent)', subtitle: 'Theta Service Partner Sdn Bhd' },
    ],
  },
  {
    number: '03',
    name: 'Skills',
    type: 'tags',
    items: [
      'Adaptability',
      'Fast Learner',
      'Teamwork',
      'Time Management',
      'Leadership',
      'Effective Communication',
      'Critical Thinking',
    ],
  },
  {
    number: '04',
    name: 'Technical Skills',
    type: 'tags',
    items: ['Java', 'HTML', 'CSS', 'Tailwind CSS', 'JavaScript', 'TypeScript', 'REST API'],
  },
  {
    number: '05',
    name: 'Languages',
    type: 'languages',
    items: [
      { language: 'English', level: 'Fluent' },
      { language: 'Chinese', level: 'Fluent' },
      { language: 'Malay', level: 'Conversational' },
      { language: 'Cantonese', level: 'Fluent' },
    ],
  },
]

function ResumeSection() {
  return (
    <section
      id="resume"
      className="rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <h2 className="mb-16 text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-tight text-[#0C0C0C] sm:mb-20 md:mb-28">
        Resume
      </h2>
      <div className="mx-auto max-w-5xl border-y border-[rgba(12,12,12,0.15)]">
        {resumeData.map((section, index) => (
          <FadeIn
            key={section.number}
            delay={index * 0.1}
            className="flex items-start gap-5 border-b border-[rgba(12,12,12,0.15)] py-8 sm:gap-8 sm:py-10 md:py-12"
          >
            <p className="text-[clamp(3rem,10vw,140px)] font-black leading-none tracking-tight text-[#0C0C0C]">
              {section.number}
            </p>
            <div className="w-full space-y-5 pt-2 sm:space-y-6">
              <h3 className="text-[clamp(1rem,2.2vw,2.1rem)] font-medium uppercase leading-none text-[#0C0C0C]">
                {section.name}
              </h3>

              {/* Education / Work Experience */}
              {(section.type === 'education' || section.type === 'experience') && (
                <div className="space-y-4 sm:space-y-5">
                  {section.items.map((item, i) => (
                    <div key={i}>
                      <p className="text-[clamp(0.9rem,1.7vw,1.35rem)] font-medium leading-snug text-[#0C0C0C]">
                        {item.title}
                      </p>
                      <p className="text-[clamp(0.8rem,1.5vw,1.1rem)] font-light leading-relaxed text-[#0C0C0C] opacity-60">
                        {item.subtitle}
                      </p>
                      {(item.period || item.detail) && (
                        <p className="text-[clamp(0.75rem,1.4vw,1rem)] font-light leading-relaxed text-[#0C0C0C] opacity-40">
                          {[item.period, item.detail].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Skills / Technical Skills */}
              {section.type === 'tags' && (
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {section.items.map((skill, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-[rgba(12,12,12,0.15)] px-4 py-1.5 text-[clamp(0.75rem,1.3vw,0.95rem)] font-light text-[#0C0C0C] opacity-70 sm:px-5 sm:py-2"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Languages */}
              {section.type === 'languages' && (
                <div className="flex flex-wrap gap-x-8 gap-y-3 sm:gap-x-10">
                  {section.items.map((lang, i) => (
                    <div key={i}>
                      <p className="text-[clamp(0.9rem,1.7vw,1.35rem)] font-medium leading-snug text-[#0C0C0C]">
                        {lang.language}
                      </p>
                      <p className="text-[clamp(0.75rem,1.4vw,1rem)] font-light leading-relaxed text-[#0C0C0C] opacity-50">
                        {lang.level}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

type Project = {
  number: string
  category: string
  name: string
  images: [string, string, string]
}

const projects: Project[] = [
  {
    number: '01',
    category: 'Client',
    name: 'Nextlevel Studio',
    images: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
    ],
  },
  {
    number: '02',
    category: 'Personal',
    name: 'Aura Brand Identity',
    images: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
    ],
  },
  {
    number: '03',
    category: 'Client',
    name: 'Solaris Digital',
    images: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
    ],
  },
]

function ProjectCard({ project }: { project: Project }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end start'],
  })

  // Only scale down — keep opacity at 1 so this card fully covers the one behind it
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85])

  return (
    <div
      ref={wrapperRef}
      className="sticky top-0 flex h-screen items-center justify-center px-5 sm:px-8 md:px-10"
    >
      <motion.article
        style={{ scale }}
        className="w-full max-w-4xl rounded-[32px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 shadow-2xl sm:rounded-[40px] sm:p-5 md:rounded-[48px] md:p-6"
      >
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3 sm:mb-6 md:mb-8">
          <div className="flex items-start gap-3 sm:gap-5 md:gap-6">
            <p className="text-[clamp(2.2rem,7vw,90px)] font-black leading-none tracking-tight text-[#D7E2EA]">
              {project.number}
            </p>
            <div className="space-y-1.5 pt-1 sm:space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#D7E2EA]/70 sm:text-sm">
                {project.category}
              </p>
              <h3 className="text-[clamp(1rem,2vw,1.8rem)] font-medium uppercase leading-none text-[#D7E2EA]">
                {project.name}
              </h3>
            </div>
          </div>
          <LiveProjectButton />
        </div>

        <div className="flex gap-3 sm:gap-4 md:gap-5">
          <div className="flex w-2/5 flex-col gap-3 sm:gap-4 md:gap-5">
            <img
              src={project.images[0]}
              alt={`${project.name} preview 1`}
              loading="lazy"
              className="h-[clamp(90px,11vw,150px)] w-full rounded-[28px] object-cover sm:rounded-[34px] md:rounded-[40px]"
            />
            <img
              src={project.images[1]}
              alt={`${project.name} preview 2`}
              loading="lazy"
              className="h-[clamp(110px,15vw,220px)] w-full rounded-[28px] object-cover sm:rounded-[34px] md:rounded-[40px]"
            />
          </div>
          <div className="w-3/5">
            <img
              src={project.images[2]}
              alt={`${project.name} preview 3`}
              loading="lazy"
              className="h-full min-h-[clamp(200px,26vw,380px)] w-full rounded-[28px] object-cover sm:rounded-[34px] md:rounded-[40px]"
            />
          </div>
        </div>
      </motion.article>
    </div>
  )
}

function ProjectsSection() {
  return (
    <section id="projects" className="relative z-10 rounded-t-[40px] bg-[#0C0C0C] pt-20 sm:rounded-t-[50px] md:rounded-t-[60px] md:pt-28">
      <h2 className="hero-heading mb-16 text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-24">
        Project
      </h2>
      {projects.map((project) => (
        <ProjectCard key={project.number} project={project} />
      ))}
    </section>
  )
}

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <motion.button
      type="button"
      onClick={scrollToTop}
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={
        isVisible
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 20, scale: 0.8 }
      }
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[#D7E2EA]/40 bg-[#0C0C0C]/90 text-[#D7E2EA] shadow-lg backdrop-blur-sm transition-colors hover:border-[#D7E2EA] hover:text-white sm:bottom-8 sm:right-8 sm:h-14 sm:w-14"
      aria-label="Scroll back to top"
    >
      <ArrowUp size={20} strokeWidth={2.2} />
    </motion.button>
  )
}

function App() {
  return (
    <main className="overflow-x-clip bg-[#0C0C0C]">
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ResumeSection />
      <ProjectsSection />
      <ScrollToTopButton />
    </main>
  )
}

export default App
