import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { PearlString, PolaroidFrame, Rose, Sparkle, StampFrame, Sticker, TapeFrame } from "@/components/decorations";
import { pickBanter } from "@/lib/banter";
import { fireTrigger } from "@/lib/media";
import photos from "@/data/photos.json";

export interface IntermissionSpec {
  id: string;
  kind: string;
  lines?: string[];
}

const CONFIRMATIONS = [
  "Are you sure?",
  "Are you really sure?",
  "Absolutely certain?",
  "Final answer?",
  "Okay. We believe you. (We don't.)",
];

const TASTES = ["Chocolate", "Filter coffee", "Something expensive", "Whatever is free"];

export function Intermission({
  spec,
  onNext,
  onComplete,
  onRegisterClick,
  clickCount,
}: {
  spec: IntermissionSpec;
  onNext: () => void;
  onComplete: (id: string) => void;
  onRegisterClick: () => void;
  clickCount: number;
}) {
  const [step, setStep] = useState(0);
  const [line, setLine] = useState("");

  useEffect(() => {
    setStep(0);
    setLine("");
  }, [spec.id]);

  function finish() {
    onComplete(spec.id);
    onNext();
  }

  if (spec.kind === "fakeLoading") {
    return <FakeLoading lines={spec.lines ?? []} onDone={finish} />;
  }

  if (spec.kind === "suspiciousButton") {
    return (
      <Shell title="Do not press this button." photoIndex={0}>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <button
            className="btn-wax cursor-pointer"
            onClick={() => {
              fireTrigger("onClick");
              onRegisterClick();
              setLine(clickCount > 12 ? pickBanter("clickHappy") : pickBanter("wrongGuess"));
              setStep((s) => s + 1);
            }}
          >
            {step === 0 ? "Press it" : step === 1 ? "Press it again" : "You're still here"}
          </button>
          {step > 0 ? (
            <button className="btn-ghost-ink cursor-pointer" onClick={finish}>
              Behave and continue
            </button>
          ) : null}
        </div>
        {line ? (
          <p className="hand mt-6 text-2xl text-center" style={{ color: "var(--cherry)" }}>
            {line}
          </p>
        ) : null}
      </Shell>
    );
  }

  if (spec.kind === "repeatedConfirmation") {
    const prompt = CONFIRMATIONS[Math.min(step, CONFIRMATIONS.length - 1)];
    return (
      <Shell title="A quick confirmation." photoIndex={1}>
        <p className="mt-6 text-2xl text-center" style={{ fontFamily: "var(--font-display)", color: "var(--burgundy)" }}>
          {prompt}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {step < CONFIRMATIONS.length - 1 ? (
            <>
              <button className="btn-wax cursor-pointer" onClick={() => setStep((s) => s + 1)}>
                Yes
              </button>
              <button className="btn-ghost-ink cursor-pointer" onClick={() => setStep((s) => s + 1)}>
                Also yes
              </button>
            </>
          ) : (
            <button className="btn-wax cursor-pointer" onClick={finish}>
              Continue
            </button>
          )}
        </div>
      </Shell>
    );
  }

  if (spec.kind === "tasteTest") {
    return (
      <Shell title="Taste test." photoIndex={2}>
        <p className="label-caps mt-4 text-center">pick the most you option</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {TASTES.map((t) => (
            <button
              key={t}
              className="paper paper-grain px-5 py-6 text-left transition-transform hover:-translate-y-1 cursor-pointer"
              onClick={() => {
                setLine(pickBanter("luxury"));
                setStep(1);
              }}
            >
              <span className="hand text-2xl" style={{ color: "var(--chocolate)" }}>
                {t}
              </span>
            </button>
          ))}
        </div>
        {step === 1 ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <p className="hand text-2xl text-center" style={{ color: "var(--cherry)" }}>
              {line}
            </p>
            <button className="btn-wax cursor-pointer" onClick={finish}>
              Continue
            </button>
          </div>
        ) : null}
      </Shell>
    );
  }

  return (
    <Shell title="An interlude." photoIndex={3}>
      <div className="flex justify-center mt-6">
        <button className="btn-wax cursor-pointer" onClick={finish}>
          Continue
        </button>
      </div>
    </Shell>
  );
}

function Shell({ title, children, photoIndex = 0 }: { title: string; children: React.ReactNode; photoIndex?: number }) {
  const photo = useMemo(() => {
    if (!photos || photos.length === 0) return null;
    return photos[(photoIndex + 5) % photos.length];
  }, [photoIndex]);

  return (
    <section className="act-section text-center relative">
      <div className="flex items-center justify-center gap-2">
        <Sparkle size={14} />
        <p className="label-caps">intermission</p>
        <Sparkle size={14} />
      </div>

      <h2
        className="mt-3 text-4xl sm:text-5xl"
        style={{ fontFamily: "var(--font-display)", color: "var(--chocolate)" }}
      >
        {title}
      </h2>

      {photo ? (
        <div className="mt-6 flex justify-center">
          <PolaroidFrame src={photo} caption="Intermission Snap 📸" rotate={-3} size="sm" />
        </div>
      ) : null}

      {children}

      <div className="mt-10 flex items-center justify-center gap-3">
        <PearlString count={5} />
        <Sticker tone="peach" rotate={-6}>
          ⏳ please wait
        </Sticker>
        <Sparkle size={16} />
      </div>
    </section>
  );
}

function FakeLoading({ lines, onDone }: { lines: string[]; onDone: () => void }) {
  const [i, setI] = useState(0);
  const all = lines.length ? lines : ["Loading…"];

  useEffect(() => {
    if (i >= all.length) return;
    const t = setTimeout(() => setI((v) => v + 1), 1400);
    return () => clearTimeout(t);
  }, [i, all.length]);

  const finished = i >= all.length;

  return (
    <section className="act-section text-center">
      <p className="label-caps">intermission</p>

      <div className="paper paper-grain mt-5 px-6 py-12 sm:px-12 shadow-2xl">
        {all.slice(0, i + 1).map((l) => (
          <motion.p
            key={l}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--cocoa)" }}
          >
            {l}
          </motion.p>
        ))}

        {finished ? (
          <>
            <p className="hand mt-6 text-2xl text-center" style={{ color: "var(--cherry)" }}>
              nothing was actually loading.
            </p>
            <div className="flex justify-center mt-6">
              <button className="btn-wax cursor-pointer" onClick={onDone}>
                Rude. Continue.
              </button>
            </div>
          </>
        ) : (
          <div className="mt-8 h-3 w-full overflow-hidden rounded-full border border-cocoa/30 bg-rosebeige">
            <motion.div
              className="h-full bg-cherry"
              initial={{ width: "8%" }}
              animate={{ width: `${Math.min(95, (i + 1) * 30)}%` }}
              transition={{ duration: 1.2 }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
