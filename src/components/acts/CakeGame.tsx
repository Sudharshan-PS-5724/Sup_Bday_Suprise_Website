import { useState } from "react";
import { motion } from "motion/react";
import { ChocolateCake3D } from "@/components/ChocolateCake3D";
import { Bow, PearlString, PolaroidFrame, Ribbon, Rose, Sparkle, StampFrame, Sticker, TapeFrame } from "@/components/decorations";
import { fireTrigger } from "@/lib/media";

export function CakeGame({
  onNext,
  onBack,
  onPick,
}: {
  onNext: () => void;
  onBack: () => void;
  onPick: (piece: number) => void;
}) {
  const [quantity, setQuantity] = useState("");
  const [submitted, setSubmitted] = useState<number | null>(null);
  const [error, setError] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const requestedPieces = Number(quantity);
    if (!Number.isInteger(requestedPieces) || requestedPieces < 1 || requestedPieces > 99) {
      setError("Oru proper number sollu ma. 1 to 99 only.");
      return;
    }
    setError("");
    setSubmitted(requestedPieces);
    onPick(requestedPieces);
    fireTrigger("cakeSelection");
  }

  const isCommunist = submitted === 1;

  return (
    <section className="act-section cake-act relative">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button className="btn-ghost-ink cursor-pointer" onClick={onBack}>
          Back
        </button>
        <div className="flex items-center gap-3">
          <Sticker tone="gold" rotate={5}>dessert committee</Sticker>
          <Sparkle size={16} />
          <PearlString count={5} />
        </div>
      </div>

      <div className="cake-heading mt-6 text-center">
        <p className="label-caps flex items-center justify-center gap-2">
          <Sparkle size={14} />
          No. 04 &middot; the cake allocation office
          <Sparkle size={14} />
        </p>
        <h2 className="mt-3 text-3xl sm:text-5xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--chocolate)" }}>
          Ok, unaku ipo cake thara porom,
        </h2>
        <p className="mt-2 text-2xl sm:text-3xl italic" style={{ fontFamily: "var(--font-display)", color: "var(--burgundy)" }}>
          but adhu evalo piece venum nu sollu 🎂✨
        </p>
      </div>
      <Ribbon className="mt-4 max-w-lg mx-auto" />

      {/* Scattered Birthday Girl Photos around 3D Cake */}
      <div className="mt-6 flex flex-wrap justify-center items-center gap-6">
        <PolaroidFrame
          src="/photos/birthday-person/whatsapp-95666-10545-0007.jpg"
          caption="Waiting for Cake 🎂"
          rotate={-6}
          size="sm"
        />
        <PolaroidFrame
          src="/photos/birthday-person/supreethaa-akash-bday.jpeg"
          caption="Birthday Girl Moments 🎉"
          rotate={5}
          size="sm"
        />
        <TapeFrame
          src="/photos/birthday-person/pradz-03.jpg"
          alt="Celebrating Supreethaa"
          rotate={-3}
        />
      </div>

      <div className="cake-showcase mt-6 grid gap-6 md:grid-cols-[1.1fr_0.9fr] items-center">
        <div className="cake-canvas-wrap relative rounded-xl overflow-hidden border-4 border-cream shadow-2xl bg-gradient-to-b from-amber-50 to-orange-50">
          <ChocolateCake3D selected={null} onSelect={() => undefined} />
          <div className="pointer-events-none absolute left-3 top-3">
            <Rose size={46} />
          </div>
          <div className="pointer-events-none absolute bottom-3 right-3">
            <Sticker tone="cherry" rotate={7}>🍒 3D Lit Cake & Candles</Sticker>
          </div>
          <div className="pointer-events-none absolute top-3 right-3 hidden sm:block">
            <Bow size={55} />
          </div>
        </div>

        <form onSubmit={submit} className="cake-form paper paper-grain tape px-6 py-8 sm:px-8 shadow-2xl rounded-sm">
          <label htmlFor="cake-pieces" className="label-caps block text-center text-sm font-bold text-chocolate">
            How many pieces of cake?
          </label>

          <div className="relative mt-4">
            <input
              id="cake-pieces"
              type="number"
              min="1"
              max="99"
              inputMode="numeric"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              placeholder="1"
              className="w-full bg-cream/60 px-4 py-4 text-center text-6xl font-bold outline-none border-2 border-burgundy rounded-sm shadow-inner"
              style={{ color: "var(--burgundy)", fontFamily: "var(--font-display)" }}
            />
            <span className="absolute right-4 bottom-4 text-xs font-mono text-cocoa">pieces</span>
          </div>

          {error ? <p className="mt-3 text-center text-sm font-semibold text-cherry">{error}</p> : null}

          <button className="btn-wax mt-6 w-full cursor-pointer text-base py-3.5 shadow-lg hover:scale-102 transition-transform" type="submit">
            Submit Selection to Committee 🍰
          </button>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <PearlString count={5} />
            <Sticker tone="sage" rotate={-3}>1 piece = real communist</Sticker>
            <Sparkle size={14} />
          </div>
        </form>
      </div>

      {submitted !== null ? (
        <motion.div
          initial={{ opacity: 0, y: 16, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          className="cake-result paper paper-grain mt-8 overflow-hidden px-6 py-8 sm:px-10 shadow-2xl rounded-sm border-2 border-gold/70"
        >
          {isCommunist ? (
            <div className="text-center py-4">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Sticker tone="sage" rotate={-4}>★ COMRADE CERTIFIED ★</Sticker>
                <Sparkle size={20} />
              </div>
              <h3 className="text-3xl sm:text-5xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--olive)" }}>
                Good, you are a real communist. ★
              </h3>
              <p className="hand mt-3 text-2xl text-cocoa">One piece. One people. One very good decision.</p>
            </div>
          ) : (
            <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
              <div className="relative">
                <img
                  src="/kaththi-communism.jpg"
                  alt="A Kaththi communism scene"
                  className="aspect-video w-full rounded-sm object-cover border-4 border-cream shadow-2xl"
                />
                <div className="absolute -top-3 -right-3">
                  <Sticker tone="cherry" rotate={5}>Kaththi Mode 🗡️</Sticker>
                </div>
              </div>

              <div className="text-center md:text-left">
                <p className="text-2xl sm:text-3xl font-bold leading-relaxed" style={{ fontFamily: "var(--font-display)", color: "var(--burgundy)" }}>
                  "Namma Pasi theendhadhuku aprom saapudra idly, innoruthangoldadhu ma"
                </p>
                <p className="hand mt-3 text-xl text-cocoa">
                  - Kaththi Vijay (Nationalising dessert since 2014)
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button className="btn-wax cursor-pointer text-base py-3 px-8" onClick={onNext}>
              Continue to Wishes
            </button>
            <Sticker tone={isCommunist ? "sage" : "cherry"} rotate={-6}>
              {submitted} {submitted === 1 ? "piece" : "pieces"} requested
            </Sticker>
            <Sparkle size={16} />
          </div>
        </motion.div>
      ) : null}
    </section>
  );
}
