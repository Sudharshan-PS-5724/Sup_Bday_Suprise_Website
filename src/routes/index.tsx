import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { Opening } from "@/components/acts/Opening";
import { PoliticalChoice } from "@/components/acts/PoliticalChoice";
import { CommonWish } from "@/components/acts/CommonWish";
import { CakeGame } from "@/components/acts/CakeGame";
import { MysteryRound } from "@/components/acts/MysteryRound";
import { Intermission, type IntermissionSpec } from "@/components/acts/Intermission";
import { Transition } from "@/components/acts/Transition";
import { Finale } from "@/components/acts/Finale";
import { AddWishModal } from "@/components/AddWishModal";
import { content, getCombinedWishes, type Wish } from "@/lib/content";
import { setupMedia } from "@/lib/mediaSetup";
import { useGame } from "@/lib/useGame";

const TITLE = "A Birthday Mystery - guess who wished you";
const DESCRIPTION = "A handmade birthday mystery of anonymous wishes, five guesses each, and a reveal at the end.";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Step =
  | { kind: "opening" }
  | { kind: "political" }
  | { kind: "common" }
  | { kind: "cake" }
  | { kind: "wish"; wishIndex: number }
  | { kind: "intermission"; spec: IntermissionSpec }
  | { kind: "transition" }
  | { kind: "finale" };

function buildSteps(currentWishes: Wish[]): Step[] {
  const intermissions = (content.intermissions ?? []) as IntermissionSpec[];
  const steps: Step[] = [
    { kind: "opening" },
    { kind: "political" },
    { kind: "common" },
    { kind: "cake" },
  ];
  let used = 0;
  currentWishes.forEach((_, i) => {
    steps.push({ kind: "wish", wishIndex: i });
    const spec = intermissions[used];
    if ((i + 1) % 2 === 0 && spec) {
      steps.push({ kind: "intermission", spec });
      used += 1;
    }
  });
  steps.push({ kind: "transition" }, { kind: "finale" });
  return steps;
}

function Index() {
  const game = useGame();
  const { state, hydrated, next, previous, update, getRound, recordGuess, completeMiniGame, registerClick, reset } = game;
  const [allWishes, setAllWishes] = useState<Wish[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setAllWishes(getCombinedWishes());
  }, []);

  const refreshWishes = () => {
    setAllWishes(getCombinedWishes());
  };

  const steps = useMemo(() => buildSteps(allWishes), [allWishes]);
  const step = steps[Math.min(state.stepIndex, steps.length - 1)]!;

  useEffect(() => {
    setupMedia();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }, [state.stepIndex]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "a") {
        window.location.href = "/admin";
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const solvedIds = allWishes.filter((w) => getRound(w.id).solved).map((w) => w.id);

  return (
    <main className="app-shell min-h-[100svh] relative">
      {!hydrated ? (
        <div className="flex min-h-[100svh] items-center justify-center">
          <p className="label-caps">opening the envelope…</p>
        </div>
      ) : step.kind === "opening" ? (
        <Opening onNext={next} />
      ) : step.kind === "political" ? (
        <PoliticalChoice onNext={next} onBack={previous} onChoose={(side) => update({ side })} />
      ) : step.kind === "common" ? (
        <CommonWish onNext={next} onBack={previous} />
      ) : step.kind === "cake" ? (
        <CakeGame onNext={next} onBack={previous} onPick={(piece) => update({ selectedCakePiece: piece })} />
      ) : step.kind === "wish" ? (
        (() => {
          const wish = allWishes[step.wishIndex]!;
          if (!wish) return null;
          const round = getRound(wish.id);
          return (
            <MysteryRound
              wish={wish}
              index={step.wishIndex}
              total={allWishes.length}
              guessesUsed={round.guessesUsed}
              solved={round.solved}
              failed={round.failed}
              onGuess={(answer, correct) => recordGuess(wish.id, answer, correct)}
              onNext={next}
            />
          );
        })()
      ) : step.kind === "intermission" ? (
        <Intermission
          spec={step.spec}
          onNext={next}
          onComplete={completeMiniGame}
          onRegisterClick={registerClick}
          clickCount={state.clickCount}
        />
      ) : step.kind === "transition" ? (
        <Transition onNext={next} />
      ) : (
        <Finale solvedIds={solvedIds} onReset={reset} />
      )}

      {/* Hidden Admin Modal (Can be triggered via secret shortcut or /admin route) */}
      <AddWishModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onWishesUpdated={refreshWishes}
      />
    </main>
  );
}
