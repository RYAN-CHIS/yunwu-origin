import ContactForm from './ContactForm'
import { Metadata } from 'next'
import SectionWrapper from '@/components/ui/SectionWrapper'

export const metadata: Metadata = {
  title: '联系允物｜允物品牌',
  description: '如果你愿意，欢迎与我们聊聊器物、生活与本心。',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--yun-paper)]">
      {/* Hero */}
      <SectionWrapper className="min-h-[40vh] flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto fade-in">
          <p className="font-display text-6xl md:text-8xl text-[var(--yun-gray)]/5 tracking-widest leading-none mb-8">
            CONTACT
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-[var(--yun-ink)] tracking-wide mb-6">
            联系允物
          </h1>
          <p className="text-lg md:text-xl text-[var(--yun-gray)] leading-relaxed max-w-2xl mx-auto">
            如果你愿意，欢迎与我们聊聊器物、生活与本心。
          </p>
        </div>
      </SectionWrapper>

      <div className="max-w-5xl mx-auto px-6 md:px-12 pb-24 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Contact Info */}
          <div className="border border-[var(--yun-border)] p-8 md:p-10 rounded-[var(--yun-radius)]">
            <h2 className="font-display text-xl text-[var(--yun-ink)] mb-8 tracking-wide">
              联系方式
            </h2>
            <div className="space-y-6">
              {process.env.NEXT_PUBLIC_WECHAT && (
                <div>
                  <p className="text-xs text-[var(--yun-gray)] tracking-wider mb-1">微信</p>
                  <p className="text-[var(--yun-ink)]">{process.env.NEXT_PUBLIC_WECHAT}</p>
                </div>
              )}
              {process.env.NEXT_PUBLIC_EMAIL && (
                <div>
                  <p className="text-xs text-[var(--yun-gray)] tracking-wider mb-1">邮箱</p>
                  <a
                    href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`}
                    className="text-[var(--yun-ink)] hover:text-[var(--yun-jade)] transition-colors"
                  >
                    {process.env.NEXT_PUBLIC_EMAIL}
                  </a>
                </div>
              )}
              {process.env.NEXT_PUBLIC_XIAOHONGSHU && (
                <div>
                  <p className="text-xs text-[var(--yun-gray)] tracking-wider mb-1">小红书</p>
                  <a
                    href={process.env.NEXT_PUBLIC_XIAOHONGSHU}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--yun-ink)] hover:text-[var(--yun-jade)] transition-colors"
                  >
                    允物 Yunwu
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div className="border border-[var(--yun-border)] p-8 md:p-10 rounded-[var(--yun-radius)]">
            <h2 className="font-display text-xl text-[var(--yun-ink)] mb-8 tracking-wide">
              与允物同行
            </h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  )
}
