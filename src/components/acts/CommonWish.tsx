import { motion } from "motion/react";
import { Bow, PearlString, PolaroidFrame, Ribbon, Rose, Sparkle, StampFrame, Sticker, TapeFrame } from "@/components/decorations";
import { content } from "@/lib/content";

export function CommonWish({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const common = content.commonWish;
  return (
    <section className="act-section flex flex-col items-center justify-center text-center py-8">
      <div className="flex items-center gap-3 justify-center mb-2">
        <Sparkle size={15} />
        <p className="label-caps">No. 03 &middot; {common.title}</p>
        <Sparkle size={15} />
      </div>

      <h2 className="text-4xl sm:text-5xl mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--chocolate)" }}>
        A Collective Blessing
      </h2>
      <Ribbon className="max-w-md mx-auto mb-6" />

      {/* Scattered Birthday Girl Photos for Page 3 */}
      <div className="w-full flex flex-wrap justify-center items-center gap-6 mb-6">
        <PolaroidFrame
          src="/photos/birthday-person/whatsapp-95666-10545-0005.jpg"
          caption="Pune Evening Vibes 🌆"
          rotate={-5}
          size="sm"
        />
        <PolaroidFrame
          src="/photos/birthday-person/whatsapp-95666-10545-0006.jpg"
          caption="Lucky Us ♡"
          rotate={4}
          size="sm"
        />
      </div>

      <motion.article
        initial={{ opacity: 0, rotate: -1.5, y: 20 }}
        animate={{ opacity: 1, rotate: -0.8, y: 0 }}
        transition={{ duration: 0.7 }}
        className="paper paper-grain tape rule-lines relative px-6 py-10 sm:px-12 max-w-2xl mx-auto text-center shadow-2xl"
      >
        <div className="absolute -right-4 -top-6 hidden sm:block">
          <Rose size={54} />
        </div>
        <div className="absolute -left-4 -bottom-6 hidden sm:block">
          <Bow size={70} />
        </div>

        <p
          className="text-[1.1rem] sm:text-[1.2rem] leading-8 font-display italic text-center"
          style={{ color: "var(--espresso)", whiteSpace: "pre-wrap" }}
        >
          {common.body}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <PearlString count={7} />
          <Sticker tone="peach" rotate={5}>
            🎀 Pune evening edition
          </Sticker>
          <Sticker tone="sage" rotate={-5}>
            ♡ lucky us
          </Sticker>
          <Sticker tone="gold" rotate={3}>
            ✨ 100% Pure Love
          </Sticker>
          <PearlString count={7} />
        </div>
      </motion.article>

      {/* Centered Buttons & Bottom Decorations */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
        <button className="btn-ghost-ink cursor-pointer" onClick={onBack}>
          Back
        </button>
        <button className="btn-wax cursor-pointer" onClick={onNext}>
          Okay but cake?
        </button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        <Sticker tone="cherry" rotate={-2}>🎂 DESSERT AWAITS</Sticker>
        <Sparkle size={16} />
      </div>
    </section>
  );
}
