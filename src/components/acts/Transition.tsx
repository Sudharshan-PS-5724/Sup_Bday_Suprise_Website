import { useEffect } from "react";
import { motion } from "motion/react";
import { PearlString, PolaroidFrame, Ribbon, Sparkle, Sticker } from "@/components/decorations";
import { content, wishes } from "@/lib/content";
import { fireTrigger } from "@/lib/media";

export function Transition({ onNext }: { onNext: () => void }) {
  const finale = content.finale;

  useEffect(() => {
    fireTrigger("onEnter");
  }, []);

  return (
    <section className="act-section text-center py-8">
      {finale.openingLines.map((line: string, i: number) => (
        <motion.p
          key={line}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 * i, duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "var(--chocolate)" }}
        >
          {line}
        </motion.p>
      ))}

      <Ribbon className="mt-6 max-w-md mx-auto" />

      {/* Scattered Birthday Girl Photos for Transition */}
      <div className="mt-6 flex flex-wrap justify-center items-center gap-6">
        <PolaroidFrame
          src="/photos/birthday-person/whatsapp-95666-10545-0008.jpg"
          caption="Grand Finale Awaits ✨"
          rotate={-4}
          size="sm"
        />
        <PolaroidFrame
          src="/photos/birthday-person/whatsapp-95666-10545-0009.jpg"
          caption="Precious Memories ♡"
          rotate={5}
          size="sm"
        />
      </div>

      <div className="mt-8 space-y-3 max-w-xl mx-auto">
        {finale.recap.map((line: string, i: number) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 * i }}
            className="text-xl leading-relaxed"
            style={{ color: "var(--cocoa)" }}
          >
            {line}
          </motion.p>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        onViewportEnter={() => fireTrigger("onScroll")}
        transition={{ delay: 0.8 }}
        className="mt-8 text-2xl italic sm:text-3xl font-semibold"
        style={{ fontFamily: "var(--font-display)", color: "var(--burgundy)" }}
      >
        {finale.turn}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="message-count-note mt-8 max-w-xl mx-auto rounded-sm p-6 shadow-2xl"
      >
        <p className="label-caps">a note for next year</p>
        <p className="mt-3 text-2xl leading-relaxed sm:text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--burgundy)" }}>
          This year it is only {wishes.length} Number of Messages. We hope to see more messages next year with more images and memories in S24 Ultra!.. Bye 📱✨
        </p>
      </motion.div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <PearlString count={9} />
        <button className="btn-wax cursor-pointer" onClick={onNext}>
          Go on to Finale
        </button>
        <Sparkle size={16} />
      </div>
    </section>
  );
}
