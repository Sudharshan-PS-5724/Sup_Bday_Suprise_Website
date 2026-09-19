import { useState } from "react";
import { motion } from "motion/react";
import { PearlString, PolaroidFrame, Ribbon, Rose, Sparkle, StampFrame, Sticker, TapeFrame } from "@/components/decorations";
import { fireTrigger } from "@/lib/media";

export function PoliticalChoice({
  onNext,
  onBack,
  onChoose,
}: {
  onNext: () => void;
  onBack: () => void;
  onChoose: (side: "left" | "right") => void;
}) {
  const [side, setSide] = useState<"left" | "right" | null>(null);

  function choose(value: "left" | "right") {
    setSide(value);
    fireTrigger("onChoice");
    onChoose(value);
  }

  return (
    <section className="act-section relative">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="label-caps">No. 02 &middot; a small formality</p>
        <PearlString count={5} />
      </div>

      <h2
        className="mt-3 text-4xl sm:text-5xl text-center"
        style={{ fontFamily: "var(--font-display)", color: "var(--chocolate)" }}
      >
        Pick a side.
      </h2>
      <Ribbon className="mt-4" />

      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <Sticker tone="peach" rotate={-5}>no take-backs</Sticker>
        <Sparkle size={16} />
        <Rose size={32} />
        <Sparkle size={16} />
        <Sticker tone="gold" rotate={5}>choose wisely</Sticker>
        <Sticker tone="sage" rotate={-2}>the ideology test</Sticker>
      </div>

      {/* Scattered Birthday Girl Photos in Act 2 */}
      <div className="mt-6 flex flex-wrap justify-center items-center gap-6">
        <PolaroidFrame
          src="/photos/birthday-person/direction-cinematography-screenplay-hari-0001.jpg"
          caption="Hahaha🚩"
          rotate={-4}
          size="sm"
        />
        <PolaroidFrame
          src="/photos/birthday-person/direction-cinematography-screenplay-hari-0002.jpg"
          caption="Hehehe? 🪷"
          rotate={5}
          size="sm"
        />
      </div>

      {!side ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <button
            onClick={() => choose("left")}
            className="political-choice paper paper-grain px-6 py-8 text-left transition-all hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
            style={{ borderColor: "var(--olive)" }}
          >
            <div className="flex items-center justify-between">
              <span
                className="block text-3xl font-bold"
                style={{ fontFamily: "var(--font-display)", color: "var(--olive)" }}
              >
                ← LEFT
              </span>
              <Sticker tone="sage" rotate={-3}>Some Vibes</Sticker>
            </div>
            <p className="mt-3 text-sm text-cocoa">
              Think and Click
            </p>
          </button>

          <button
            onClick={() => choose("right")}
            className="political-choice paper paper-grain px-6 py-8 text-right transition-all hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
            style={{ borderColor: "var(--burgundy)" }}
          >
            <div className="flex items-center justify-between flex-row-reverse">
              <span
                className="block text-3xl font-bold"
                style={{ fontFamily: "var(--font-display)", color: "var(--burgundy)" }}
              >
                RIGHT →
              </span>
              <Sticker tone="cherry" rotate={4}>Which side?</Sticker>
            </div>
            <p className="mt-3 text-sm text-cocoa">
              Same. Think and Click
            </p>
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="paper paper-grain mt-8 px-6 py-10 sm:px-10 text-center"
        >
          {side === "left" ? (
            <>
              <div className="relative inline-block">
                <img
                  src="/left-right/DMK.jpg"
                  alt="A rising-sun illustration for the left choice"
                  className="mx-auto aspect-square w-full max-w-xs rounded-sm object-cover border-4 border-cream shadow-xl"
                />
                <div className="absolute -bottom-3 -right-3">
                  <StampFrame src="/photos/birthday-person/whatsapp-95666-10545-0003.jpg" rotate={6} />
                </div>
              </div>
              <p className="mt-6 text-center text-2xl sm:text-3xl leading-snug" style={{ fontFamily: "var(--font-display)", color: "var(--olive)" }}>
                Everything is Everyone, you stood by your leftist take even in direction! 🚩
              </p>
            </>
          ) : (
            <>
              <div className="relative inline-block">
                <img
                  src="/left-right/BJP.jpg"
                  alt="A lotus illustration for the right choice"
                  className="mx-auto aspect-square w-full max-w-xs rounded-sm object-cover border-4 border-cream shadow-xl"
                />
                <div className="absolute -bottom-3 -left-3">
                  <TapeFrame src="/photos/birthday-person/whatsapp-95666-10545-0004.jpg" rotate={-6} />
                </div>
              </div>
              <p className="mt-6 text-center text-2xl sm:text-3xl leading-snug" style={{ fontFamily: "var(--font-display)", color: "var(--burgundy)" }}>
                What made you click right, you right wing ally😂 Writing in right is ok but righting right may take your rights off 🪷
              </p>
            </>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button className="btn-ghost-ink cursor-pointer" onClick={onBack}>
              Back
            </button>
            <button className="btn-wax cursor-pointer" onClick={onNext}>
              Continue
            </button>
            <Sticker tone={side === "left" ? "sage" : "gold"} rotate={-6}>
              ★ duly recorded
            </Sticker>
            <Sparkle />
          </div>
        </motion.div>
      )}

      {!side ? (
        <div className="mt-8 flex justify-center">
          <button className="btn-ghost-ink cursor-pointer" onClick={onBack}>
            Back
          </button>
        </div>
      ) : null}
    </section>
  );
}
