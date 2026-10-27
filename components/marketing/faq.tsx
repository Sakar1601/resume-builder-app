import { Plus } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { SectionHeading } from "@/components/marketing/section-heading"

const FAQS = [
  ["Is it really free to try?", "Yes. Guest mode gives you the full editor, AI tools and PDF export without an account. Creating an account just saves your resumes to the cloud so they follow you across devices."],
  ["Where does my data go in guest mode?", "Guest resumes are stored in your browser’s local storage and never leave your device, except the text you explicitly send to the AI. Clearing browser data erases them, so create an account to keep them."],
  ["Will the AI make up experience for me?", "No. The prompts forbid inventing experience, metrics or accomplishments, and ask for placeholders like [X%] wherever a number would help. You always review and apply suggestions yourself."],
  ["Will recruiters’ ATS software read the PDF?", "The layout is single-column with real, selectable text and standard section headings, the format applicant tracking systems parse most reliably."],
  ["Can I keep several versions?", "Yes. Duplicate any resume in one click and tailor each copy to a different role."],
]

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 border-t px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal>
            <SectionHeading eyebrow="FAQ">
              Questions, <span className="italic text-primary">answered</span> straight
            </SectionHeading>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="lg:col-span-7">
          {FAQS.map(([q, a]) => (
            <details key={q} className="group border-t py-6 last:border-b">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-medium [&::-webkit-details-marker]:hidden">
                {q}
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 group-open:rotate-45 group-open:bg-primary group-open:text-primary-foreground">
                  <Plus className="size-4" />
                </span>
              </summary>
              <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">{a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
