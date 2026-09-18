import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { Play, Pause, Volume2, Eye } from "lucide-react";
import { Bow, PearlString, PolaroidFrame, PushPin, Rose, Sparkle, Stamp, StampFrame, Sticker } from "@/components/decorations";
import { pickBanter } from "@/lib/banter";
import { isMatch } from "@/lib/matching";
import { fireTrigger } from "@/lib/media";
import { GUESSES_PER_WISH, type Wish } from "@/lib/content";
import { useTimer } from "@/lib/useGame";
import photos from "@/data/photos.json";

const STYLES: Record<string, string> = {
  letter: "paper paper-grain rule-lines",
  postcard: "paper paper-grain deckle",
  polaroid: "paper",
  diary: "paper rule-lines",
  note: "paper tape",
  clipping: "paper paper-grain torn-bottom",
  sticker: "paper",
  invitation: "paper paper-grain deckle tape",
};

const FORMAT_LABELS: Record<string, string> = {
  letter: "personal correspondence",
  postcard: "postmarked evidence",
  polaroid: "instant memory",
  diary: "private entry",
  note: "found note",
  clipping: "archived clipping",
  sticker: "sealed statement",
  invitation: "private invitation",
};

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export function MysteryRound({
  wish,
  index,
  total,
  guessesUsed,
  solved,
  failed,
  onGuess,
  onNext,
}: {
  wish: Wish;
  index: number;
  total: number;
  guessesUsed: number;
  solved: boolean;
  failed: boolean;
  onGuess: (answer: string, correct: boolean) => void;
  onNext: () => void;
}) {
  const [value, setValue] = useState("");
  const [line, setLine] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [nameRevealed, setNameRevealed] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timer = useTimer();

  // Select a unique birthday person photo for this wish round from photos.json
  const birthdayPhoto = useMemo(() => {
    if (!photos || photos.length === 0) return null;
    return photos[index % photos.length];
  }, [index]);

  const remaining = Math.max(0, GUESSES_PER_WISH - guessesUsed);
  const roundFinished = solved || failed || remaining === 0;

  // Cleanup audio when wish ID changes or round resets
  useEffect(() => {
    timer.restart();
    setValue("");
    setLine("");
    setIsPlaying(false);
    setNameRevealed(false);
    setCurrentTime(0);
    setDuration(0);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [wish.id]);

  // Audio Surprise Phase: ONLY triggered AFTER roundFinished is true (correct guess OR 5 attempts exhausted)
  useEffect(() => {
    if (!roundFinished) {
      // Ensure audio is stopped while guessing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlaying(false);
      setNameRevealed(false);
      return;
    }

    // Guessing is complete! Start surprise audio phase with hidden name.
    setNameRevealed(false);

    if (wish.audio) {
      const audio = new Audio(wish.audio);
      audioRef.current = audio;

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
        if (audio.duration) setDuration(audio.duration);
      };
      const handleEnded = () => {
        setIsPlaying(false);
        setNameRevealed(true); // Automatically reveal name when audio finishes playing!
      };

      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleEnded);

      // Start playing voice note ONLY NOW (after guessing finished)
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));

      return () => {
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("ended", handleEnded);
        audio.pause();
        audioRef.current = null;
      };
    } else {
      // If wish has no audio file, brief 2s suspense moment then reveal name
      const fallbackTimer = setTimeout(() => {
        setNameRevealed(true);
      }, 2000);
      return () => clearTimeout(fallbackTimer);
    }
  }, [roundFinished, wish.id, wish.audio]);

  // Reliable Play/Pause toggle function
  function toggleAudio() {
    if (!audioRef.current && wish.audio) {
      const audio = new Audio(wish.audio);
      audioRef.current = audio;

      audio.addEventListener("play", () => setIsPlaying(true));
      audio.addEventListener("pause", () => setIsPlaying(false));
      audio.addEventListener("timeupdate", () => {
        setCurrentTime(audio.currentTime);
        if (audio.duration) setDuration(audio.duration);
      });
      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        setNameRevealed(true);
      });
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }

  function forceRevealNow() {
    setNameRevealed(true);
  }

  const paragraphs = wish.wish.split(/\n{2,}/);

  const cardClass = useMemo(
    () => STYLES[String(wish.visualStyle ?? "letter")] ?? STYLES["letter"]!,
    [wish.visualStyle],
  );

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const answer = value.trim();
    if (!answer || roundFinished) return;

    const correct = isMatch(answer, wish.name, wish.aliases);
    const elapsed = timer.elapsed();
    onGuess(answer, correct);
    setValue("");
    timer.restart();

    const scope = `wish-${wish.id}`;

    if (correct) {
      setLine(pickBanter("correctGuess"));
      fireTrigger("onCorrect", scope);
      return;
    }

    if (guessesUsed + 2 === GUESSES_PER_WISH) fireTrigger("onLastGuess", scope);
    else fireTrigger("onWrong", scope);

    if (guessesUsed + 1 >= GUESSES_PER_WISH) {
      setLine(pickBanter("failed"));
    } else if (elapsed < 1800) {
      setLine(pickBanter("tooFast"));
    } else if (elapsed > 25000) {
      setLine(pickBanter("tooSlow"));
    } else if (guessesUsed + 1 === GUESSES_PER_WISH - 1) {
      setLine(pickBanter("lastAttempt"));
    } else if (guessesUsed + 1 >= 3) {
      setLine(pickBanter("streakWrong"));
    } else {
      setLine(pickBanter("wrongGuess"));
    }
  }

  return (
    <section className={`act-section mystery-act mystery-${String(wish.visualStyle ?? "letter")} relative`}>
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cocoa/20 pb-3 mb-12">
        <div className="flex items-center gap-2">
          <p className="label-caps">
            wish {index + 1} of {total}
          </p>
          <Sparkle size={14} />
          <Sticker tone="gold" rotate={-2}>Mystery #{wish.id}</Sticker>
        </div>

        <div className="flex items-center gap-3">
          <PearlString count={5} />
          <div className="flex shrink-0 items-center gap-2" aria-label={`${remaining} guesses remaining`}>
            {Array.from({ length: GUESSES_PER_WISH }).map((_, i) => (
              <span
                key={i}
                className="block h-3 w-3 rounded-full transition-colors"
                style={{
                  background: i < guessesUsed ? "var(--cherry)" : "transparent",
                  border: "1.5px solid var(--cocoa)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Wish Paper Card */}
      <motion.article
        key={wish.id}
        initial={{ opacity: 0, y: 24, rotate: -1 }}
        animate={{ opacity: 1, y: 0, rotate: index % 2 ? 0.8 : -0.9 }}
        transition={{ duration: 0.6 }}
        className={`${cardClass} wish-evidence relative mt-12 pt-14 shadow-2xl`}
      >
        {/* Top Center Pinned Photo Stamp on the Letter */}
        {birthdayPhoto ? (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 transition-transform hover:scale-110">
            <div className="relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30">
                <PushPin color="var(--cherry)" />
              </div>
              <StampFrame
                src={birthdayPhoto}
                alt={`Memory #${index + 1} with Supreethaa`}
                rotate={index % 2 === 0 ? -3 : 3}
                className="shadow-xl border-2 border-cream"
              />
            </div>
          </div>
        ) : null}

        <div className="wish-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>

        <div className="absolute -right-3 -top-5 hidden sm:block">
          <Rose size={46} />
        </div>
        <div className="absolute -left-3 -bottom-4 hidden sm:block">
          <Bow size={60} />
        </div>

        <div className="wish-evidence-meta flex flex-wrap justify-between items-center border-b border-cocoa/20 pb-2">
          <span>{FORMAT_LABELS[String(wish.visualStyle ?? "letter")] ?? "anonymous evidence"}</span>
          <span className="flex items-center gap-2">
            <Sparkle size={12} />
            Virtual · {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="wish-copy mt-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <Stamp label="a birthday letter" />
            <Sticker tone="sage" rotate={-2}>Authentic Wish</Sticker>
          </div>

          <div className="wish-text">
            {paragraphs.map((paragraph, paragraphIndex) => (
              <p key={`${wish.id}-${paragraphIndex}`} className="wish-paragraph">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="wish-signoff mt-8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <PearlString count={6} />
              <span className="hand text-xl text-taupe">
                - {nameRevealed ? wish.name : "someone who cares"}
              </span>
            </div>
            <Sticker tone="blush" rotate={3}>♡ Warmest regards</Sticker>
          </div>
        </div>
      </motion.article>

      {/* Accuse Input Form (Only while active guessing) */}
      {!roundFinished ? (
        <form onSubmit={submit} className="mt-8">
          <label className="label-caps flex items-center justify-between" htmlFor={`guess-${wish.id}`}>
            <span>who wrote this?</span>
            <span className="text-cocoa font-semibold">{remaining} of {GUESSES_PER_WISH} attempts left</span>
          </label>

          <div className="guess-row mt-3">
            <input
              id={`guess-${wish.id}`}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Type a name"
              autoComplete="off"
              className="paper w-full min-w-0 flex-1 px-4 py-3 outline-none rounded-sm border-b-2 border-burgundy"
              style={{ color: "var(--espresso)", fontFamily: "var(--font-sans)" }}
            />
            <button type="submit" className="btn-wax cursor-pointer">
              Guess
            </button>
          </div>

          <p className="mt-3 text-sm text-taupe flex items-center gap-2">
            <Sparkle size={12} />
            {remaining} {remaining === 1 ? "guess" : "guesses"} remaining. Submit your guess!
          </p>
        </form>
      ) : null}

      {/* Banter text line */}
      {line ? (
        <motion.p
          key={line}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="hand mt-6 text-2xl text-center font-bold"
          style={{ color: solved ? "var(--olive)" : "var(--cherry)", whiteSpace: "pre-wrap" }}
        >
          {line}
        </motion.p>
      ) : null}

      {/* PHASE 1: AUDIO SURPRISE PHASE (Starts ONLY AFTER guessing is complete; Name is HIDDEN) */}
      {roundFinished && !nameRevealed ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-7 paper paper-grain px-6 py-6 text-center rounded-sm border-2 border-gold bg-amber-50/90 shadow-2xl"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sticker tone="gold" rotate={-3}>🎙️ VOICE NOTE SURPRISE!</Sticker>
            <Sparkle size={16} />
          </div>

          <p className="font-display text-2xl text-chocolate font-bold">
            Listen closely to the voice note...
          </p>

          <p className="text-sm text-cocoa mt-1 font-sans">
            Guess who this voice belongs to! Name reveals automatically when voice note ends.
          </p>

          {/* Audio Progress Bar */}
          {wish.audio && duration > 0 ? (
            <div className="mt-4 max-w-md mx-auto">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-rosebeige/50 border border-cocoa/30">
                <div
                  className="h-full bg-gradient-to-r from-gold via-cherry to-burgundy transition-all duration-200"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs font-mono text-cocoa mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          ) : null}

          {/* Audio Controls during Surprise Phase */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
            {wish.audio ? (
              <button
                onClick={toggleAudio}
                className="flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-chocolate text-cream font-semibold text-sm hover:bg-cocoa transition-all hover:scale-105 cursor-pointer shadow-md"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? "Pause Voice Note" : "Play Voice Note"}
              </button>
            ) : null}

            <button
              onClick={forceRevealNow}
              className="btn-ghost-ink text-xs cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="h-3.5 w-3.5" />
              Reveal Name Now
            </button>
          </div>
        </motion.div>
      ) : null}

      {/* PHASE 2: NAME REVEALED AFTER AUDIO FINISHES */}
      {roundFinished && nameRevealed ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="failed-reveal mt-7 text-center rounded-sm p-6 border-2 border-dashed border-burgundy/60 bg-blush/30 shadow-lg"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sticker tone={solved ? "sage" : "cherry"} rotate={-3}>
              {solved ? "✓ CORRECTLY ACCUSED" : "★ WISHER REVEALED ★"}
            </Sticker>
            <Sparkle size={16} />
          </div>

          <p className="label-caps text-taupe">This wish was written by</p>

          <h3 className="mt-2 text-4xl sm:text-5xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--burgundy)" }}>
            {wish.name}
          </h3>

          {wish.revealNote ? (
            <p className="hand mt-3 text-xl text-cocoa">
              "{wish.revealNote}"
            </p>
          ) : null}

          {/* Replayable Audio Player after Reveal */}
          {wish.audio ? (
            <div className="mt-5 paper paper-grain px-5 py-3 flex flex-wrap items-center justify-between gap-4 rounded-sm border-2 border-gold/60 bg-cream/90 shadow-md">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleAudio}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-chocolate text-cream hover:bg-cocoa transition-transform hover:scale-105 cursor-pointer shadow-md"
                  title={isPlaying ? "Pause voice note" : "Play voice note"}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                </button>
                <div className="text-left">
                  <p className="text-xs uppercase tracking-widest font-semibold text-burgundy flex items-center gap-1.5">
                    <Volume2 className="h-3.5 w-3.5" />
                    Replay {wish.name}&apos;s Voice Note
                  </p>
                  <p className="text-xs text-cocoa font-mono mt-0.5">
                    {isPlaying ? `${formatTime(currentTime)} / ${formatTime(duration)}` : "Click play to listen again"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isPlaying ? (
                  <div className="flex items-end gap-1 h-5">
                    <span className="w-1 bg-cherry h-full animate-bounce" />
                    <span className="w-1 bg-gold h-3/4 animate-bounce delay-75" />
                    <span className="w-1 bg-olive h-full animate-bounce delay-150" />
                    <span className="w-1 bg-rose h-1/2 animate-bounce delay-100" />
                  </div>
                ) : null}
                <Sticker tone="peach" rotate={3}>🎙️ Voice Note</Sticker>
              </div>
            </div>
          ) : null}
        </motion.div>
      ) : null}

      {/* Meme / Reaction Image */}
      {roundFinished && nameRevealed && wish.meme ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96, rotate: 1.5 }}
          animate={{ opacity: 1, scale: 1, rotate: -1.2 }}
          className="mt-6 flex justify-center"
        >
          <img
            src={wish.meme}
            alt="A reaction picture chosen for this moment"
            loading="lazy"
            className="max-h-[32svh] w-auto max-w-full rounded-sm object-contain border-8 border-cream shadow-2xl"
          />
        </motion.div>
      ) : null}

      {/* Next / Continue Action */}
      {roundFinished && nameRevealed ? (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button className="btn-wax cursor-pointer" onClick={onNext}>
            {solved ? "Next mystery" : "Continue to next wish"}
          </button>
          {solved ? (
            <>
              <Sticker tone="sage" rotate={-5}>
                ✓ solved in {guessesUsed} {guessesUsed === 1 ? "try" : "tries"}
              </Sticker>
              <Sparkle size={16} />
            </>
          ) : (
            <Sticker tone="cherry" rotate={6}>
              ✕ 5 guesses used
            </Sticker>
          )}
        </div>
      ) : null}
    </section>
  );
}
