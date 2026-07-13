'use client'

import { Github, Instagram, Twitter, Sparkles } from 'lucide-react'
import { SplineScene } from '@/components/ui/splite' // Change to 'spline' if that's your actual file name
import { Card } from '@/components/ui/card'
import { Spotlight } from '@/components/ui/spotlight'

export function SplineSceneBasic() {
  return (
    <Card className="relative h-[500px] w-full overflow-hidden rounded-[40px] border-[#D7E2EA]/30 bg-black/[0.96] text-white sm:rounded-[50px] md:h-[560px] md:rounded-[60px]">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

      <div className="flex h-full flex-col md:flex-row">
        {/* Left Content */}
        <div className="relative z-10 flex flex-1 flex-col justify-center p-8 md:p-10">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-neutral-300 md:text-sm">
            <Sparkles size={16} />
            Software Engineer
          </p>

          <h1 className="mt-4 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Hi, I&apos;m Zhi Hin Foong
          </h1>

          <p className="mt-4 max-w-lg text-neutral-300">
            I&apos;m a software engineer who loves building clean, functional, and
            thoughtful digital experiences—from robust backend systems to
            interactive front-end interfaces.
          </p>

          {/* Social Links */}
          <div className="mt-6 flex items-center gap-3">
            <a
              href="https://github.com/your-username"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D7E2EA]/40 text-neutral-300 transition-colors hover:border-[#D7E2EA] hover:text-white"
            >
              <Github size={18} />
            </a>

            <a
              href="https://instagram.com/your-username"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D7E2EA]/40 text-neutral-300 transition-colors hover:border-[#D7E2EA] hover:text-white"
            >
              <Instagram size={18} />
            </a>

            <a
              href="https://x.com/your-username"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D7E2EA]/40 text-neutral-300 transition-colors hover:border-[#D7E2EA] hover:text-white"
            >
              <Twitter size={18} />
            </a>
          </div>
        </div>

        {/* Right Spline Scene */}
        <div className="relative flex-1">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="h-full w-full"
          />
        </div>
      </div>
    </Card>
  )
}