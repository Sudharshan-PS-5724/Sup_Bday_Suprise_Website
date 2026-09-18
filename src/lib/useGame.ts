import { useCallback, useEffect, useRef, useState } from "react";
import { GUESSES_PER_WISH } from "./content";

export interface WishRoundState {
  wishId: number;
  guessesUsed: number;
  solved: boolean;
  failed: boolean;
  submittedAnswers: string[];
}

export interface GameState {
  stepIndex: number;
  rounds: Record<string, WishRoundState>;
  side: "left" | "right" | null;
  selectedCakePiece: number | null;
  completedMiniGames: string[];
  clickCount: number;
}

const STORAGE_KEY = "birthday-mystery-state-v1";

const initialState: GameState = {
  stepIndex: 0,
  rounds: {},
  side: null,
  selectedCakePiece: null,
  completedMiniGames: [],
  clickCount: 0,
};

function load(): GameState {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    return { ...initialState, ...(JSON.parse(raw) as Partial<GameState>) };
  } catch {
    return initialState;
  }
}

export function useGame() {
  const [state, setState] = useState<GameState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable - the game still works in-memory */
    }
  }, [state, hydrated]);

  const update = useCallback((patch: Partial<GameState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const next = useCallback(() => {
    setState((prev) => ({ ...prev, stepIndex: prev.stepIndex + 1 }));
  }, []);

  const previous = useCallback(() => {
    setState((prev) => ({ ...prev, stepIndex: Math.max(0, prev.stepIndex - 1) }));
  }, []);

  const registerClick = useCallback(() => {
    setState((prev) => ({ ...prev, clickCount: prev.clickCount + 1 }));
  }, []);

  const getRound = useCallback(
    (wishId: number): WishRoundState =>
      state.rounds[String(wishId)] ?? {
        wishId,
        guessesUsed: 0,
        solved: false,
        failed: false,
        submittedAnswers: [],
      },
    [state.rounds],
  );

  const recordGuess = useCallback((wishId: number, answer: string, correct: boolean) => {
    setState((prev) => {
      const key = String(wishId);
      const current = prev.rounds[key] ?? {
        wishId,
        guessesUsed: 0,
        solved: false,
        failed: false,
        submittedAnswers: [],
      };
      const guessesUsed = current.guessesUsed + 1;
      return {
        ...prev,
        rounds: {
          ...prev.rounds,
          [key]: {
            ...current,
            guessesUsed,
            solved: correct || current.solved,
            failed: !correct && guessesUsed >= GUESSES_PER_WISH,
            submittedAnswers: [...current.submittedAnswers, answer],
          },
        },
      };
    });
  }, []);

  const completeMiniGame = useCallback((id: string) => {
    setState((prev) =>
      prev.completedMiniGames.includes(id)
        ? prev
        : { ...prev, completedMiniGames: [...prev.completedMiniGames, id] },
    );
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  }, []);

  return {
    state,
    hydrated,
    update,
    next,
    previous,
    getRound,
    recordGuess,
    completeMiniGame,
    registerClick,
    reset,
  };
}

/** Measures how long the player took between prompt and submit. */
export function useTimer() {
  const startedAt = useRef<number>(Date.now());
  const restart = useCallback(() => {
    startedAt.current = Date.now();
  }, []);
  const elapsed = useCallback(() => Date.now() - startedAt.current, []);
  return { restart, elapsed };
}
