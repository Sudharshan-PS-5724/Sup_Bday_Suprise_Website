import { useState } from "react";
import { motion } from "motion/react";
import { Bow, PearlString, Rose, Sparkle, Sticker } from "@/components/decorations";
import { BirthdayPhotoGallery } from "@/components/BirthdayPhotoGallery";
import { birthdayPhotos, content, languages, wishes } from "@/lib/content";
import { fireTrigger } from "@/lib/media";

export function Finale({
  solvedIds,
  onReset,
}: {
  solvedIds: number[];
  onReset: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const finale = content.finale;

  return (
    <section className="act-section finale-section">
      <div className="paper paper-grain deckle relative px-6 py-14 sm:px-12">
        <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 sway">
          <Bow size={120} />
        </div>
        <div className="mt-8 space-y-5">
          {finale.body.map((p: string) => (
            <motion.p
              key={p}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-[1.08rem] leading-8"
              style={{ color: "var(--espresso)" }}
            >
              {p}
            </motion.p>
          ))}
        </div>
        <div className="mt-8 flex items-center gap-3">
          <PearlString count={9} />
          <Sparkle />
          <Rose size={40} />
        </div>
      </div>

      {!revealed ? (
        <div className="mt-12 text-center">
          <p className="label-caps">the part you actually wanted</p>
          <button
            className="btn-wax mt-5"
            onClick={() => {
              setRevealed(true);
              fireTrigger("onReveal");
            }}
          >
            Reveal everyone
          </button>
          <p className="hand mt-4 text-xl" style={{ color: "var(--cherry)" }}>
            you solved {solvedIds.length} of {wishes.length}. we&apos;re not judging. much.
          </p>
        </div>
      ) : (
        <div className="mt-12">
          <h2
            className="text-4xl sm:text-5xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--chocolate)" }}
          >
            It was them. All along.
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {wishes.map((w, i) => {
              const solved = solvedIds.includes(w.id);
              return (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, y: 18, rotate: i % 2 ? 1 : -1 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.06 * i }}
                  className="paper paper-grain tape overflow-hidden px-5 py-7"
                >
                  <p className="label-caps">wish no. {w.id}</p>
                  <p
                    className="mt-2 text-2xl"
                    style={{ fontFamily: "var(--font-display)", color: "var(--burgundy)" }}
                  >
                    {w.name}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Sticker tone={solved ? "sage" : "cherry"} rotate={solved ? -4 : 5}>
                      {solved ? "✓ you knew" : "✕ you had no idea"}
                    </Sticker>
                    {w.audio ? (
                      <button
                        type="button"
                        className="btn-ghost-ink min-h-11"
                        onClick={() => fireTrigger("onReveal", `wish-${w.id}`)}
                      >
                        ▸ play their voice note
                      </button>
                    ) : null}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <BirthdayPhotoGallery photos={birthdayPhotos} />

          {!showLanguages ? (
            <div className="mt-14 text-center">
              <button
                className="btn-wax"
                onClick={() => {
                  setShowLanguages(true);
                  fireTrigger("onComplete");
                }}
              >
                One last thing
              </button>
            </div>
          ) : (
            <div className="mt-14">
              <p className="label-caps text-center">from all of us, in every language we could find</p>
              <div className="mt-8 space-y-4">
                {languages.map((l, i) => (
                  <motion.p
                    key={l.language}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10% 0px" }}
                    transition={{ delay: Math.min(0.04 * i, 0.5) }}
                    className="text-center text-xl"
                    style={{ fontFamily: "var(--font-display)", color: "var(--cocoa)" }}
                  >
                    {l.text}
                    <span className="label-caps ml-2">{l.language}</span>
                  </motion.p>
                ))}
              </div>

              <div className="mt-16 text-center">
                <Bow size={130} className="mx-auto sway" />
                <p
                  className="mt-6 text-3xl sm:text-4xl"
                  style={{ fontFamily: "var(--font-display)", color: "var(--burgundy)" }}
                >
                  Happy birthday, {String(content.recipient)}.
                </p>
                <button className="btn-ghost-ink mt-10" onClick={onReset}>
                  Play it all again
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
