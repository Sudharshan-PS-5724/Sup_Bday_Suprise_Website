import { motion } from "motion/react";
import { ArrowRight, Gem } from "lucide-react";
import { Bow, PearlString, PolaroidFrame, Rose, Sparkle, StampFrame, Sticker, TapeFrame } from "@/components/decorations";

export function Opening({ onNext }: { onNext: () => void }) {
  return (
    <section className="opening-stage relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-center px-4 py-8 sm:px-8 sm:py-12 lg:py-16">
      {/* Top Floating Decorative Badge */}
      <div className="mb-4 flex items-center justify-between gap-3 w-full px-2">
        <div className="flex items-center gap-3">
          <Sticker tone="gold" rotate={-4}>✦ Edition No. 23</Sticker>
          <Sparkle size={16} />
          <PearlString count={5} />
        </div>
        <Sticker tone="cherry" rotate={3}>CLASSIFIED ARCHIVE</Sticker>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18, rotate: -0.4 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="editorial-spread relative grid overflow-hidden rounded-md lg:grid-cols-[1.08fr_0.92fr] shadow-2xl"
      >
        <div className="paper-fold pointer-events-none absolute inset-y-0 left-1/2 z-20 hidden w-px lg:block" />

        {/* LEFT COLUMN: DARK EDITORIAL PAGE */}
        <div className="editorial-page editorial-page-dark relative flex flex-col justify-between overflow-hidden px-6 py-8 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-4">
              <p className="label-caps label-light">Private archive · 01</p>
              <div className="flex items-center gap-2">
                <Sparkle size={14} />
                <Gem aria-hidden="true" className="h-4 w-4 text-gold" strokeWidth={1.4} />
              </div>
            </div>

            <h1 className="opening-name mt-6 text-parchment">
              <span className="block text-2xl sm:text-3xl font-light text-rosebeige tracking-wide uppercase">For</span>
              <span className="block whitespace-nowrap italic tracking-tight text-[clamp(1.1rem,3.4vw,2.5rem)] text-rose mt-1">
                Our short cute minion
              </span>
            </h1>

            <p className="mt-5 max-w-sm font-display text-xl italic leading-relaxed text-rosebeige sm:text-2xl">
              We don&apos;t want to say what&apos;s inside. Find it by yourself.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <Sticker tone="cherry" rotate={-3}>CLASSIFIED</Sticker>
              <Sparkle size={14} />
              <Sticker tone="peach" rotate={4}>♡ CONFIDENTIAL</Sticker>
            </div>
          </div>

          {/* Left Column Bottom Content: Exhibit Card & Photo Frame (In Flow, No Absolute Overlaps) */}
          <div className="relative z-10 mt-10 flex flex-wrap items-end justify-between gap-6">
            <div className="evidence-card -rotate-3 transition-transform hover:rotate-0">
              <span className="label-caps">Exhibit A</span>
              <span className="mt-2 block font-hand text-2xl text-burgundy leading-tight">
                a rich taste,<br />just like H&amp;M, Zara<br />and Theobroma.
              </span>
            </div>

            <PolaroidFrame
              src="/photos/birthday-person/pradz-01.jpg"
              caption="Main Character ✨"
              rotate={4}
              size="sm"
            />
          </div>

          <div className="pointer-events-none absolute -bottom-12 -right-6 opacity-30">
            <span className="font-display text-[12rem] italic leading-none text-rose">S</span>
          </div>
        </div>

        {/* RIGHT COLUMN: LIGHT EDITORIAL PAGE */}
        <div className="editorial-page editorial-page-light relative flex flex-col justify-between overflow-hidden px-6 py-8 text-center sm:px-10 sm:py-12 lg:px-12 lg:py-14">
          <div className="flex justify-end w-full">
            <Bow size={70} />
          </div>

          {/* Right Column Center Content: Title, Description, Action */}
          <div className="relative z-10 max-w-md mx-auto my-4">
            <div className="mx-auto flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-12 bg-gold" />
              <Sparkle size={15} />
              <Rose size={36} />
              <Sparkle size={15} />
              <span className="h-px w-12 bg-gold" />
            </div>

            <h2 className="font-display text-4xl leading-none text-chocolate sm:text-5xl font-bold">
              Virtual Birthday
              <span className="block italic text-burgundy mt-1">Gathering</span>
            </h2>

            <p className="mt-5 font-display text-lg sm:text-xl italic leading-relaxed text-cocoa">
              Someone wished you. We&apos;re not telling you who. You get five accusations and absolutely no dignity.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <Sticker tone="gold" rotate={3}>★ CERTIFIED ICON</Sticker>
              <Sticker tone="sage" rotate={-4}>🎀 BIRTHDAY GIRL</Sticker>
              <Sticker tone="blush" rotate={2}>✨ 100% PURE JOY</Sticker>
            </div>

            <div className="mt-8 flex justify-center">
              <button className="btn-wax group cursor-pointer text-base py-3.5 px-8" onClick={onNext}>
                Open the case
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              <PearlString count={7} />
            </div>

            <p className="label-caps mt-4">handled with exquisite care</p>
          </div>

          {/* Right Column Bottom Content: Scattered Photo Frame (In Flow, No Overlaps) */}
          <div className="mt-6 flex justify-center sm:justify-end w-full relative z-10">
            <StampFrame src="/photos/birthday-person/pradz-02.jpg" rotate={5} />
          </div>
        </div>
      </motion.div>

      <p className="label-caps mx-auto mt-6 text-center text-rosebeige flex items-center gap-2">
        <Sparkle size={12} />
        scrolling is unnecessary · curiosity is not
        <Sparkle size={12} />
      </p>
    </section>
  );
}
