"use client";

import { useEffect, useMemo, useState } from "react";

type Player = "X" | "O";
type Cell = Player | null;

type Scores = {
  X: number;
  O: number;
  draws: number;
};

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

const EMPTY_BOARD: Cell[] = Array(9).fill(null);
const SCORE_KEY = "tictactoe-scores";

function getWinner(board: Cell[]) {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line: [...line] as number[] };
    }
  }
  return null;
}

export default function TicTacToe() {
  const [board, setBoard] = useState<Cell[]>(EMPTY_BOARD);
  const [current, setCurrent] = useState<Player>("X");
  const [scores, setScores] = useState<Scores>({ X: 0, O: 0, draws: 0 });

  const winner = useMemo(() => getWinner(board), [board]);
  const isDraw = !winner && board.every(Boolean);
  const gameOver = Boolean(winner) || isDraw;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SCORE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored) as Partial<Scores>;
      setScores({
        X: Number(parsed.X) || 0,
        O: Number(parsed.O) || 0,
        draws: Number(parsed.draws) || 0,
      });
    } catch {
      // Ignore unreadable storage and start from zero.
    }
  }, []);

  function saveScores(next: Scores) {
    setScores(next);
    localStorage.setItem(SCORE_KEY, JSON.stringify(next));
  }

  function handleMove(index: number) {
    if (gameOver || board[index]) return;

    const nextBoard = [...board];
    nextBoard[index] = current;
    const nextWinner = getWinner(nextBoard);
    const nextDraw = !nextWinner && nextBoard.every(Boolean);

    setBoard(nextBoard);
    setCurrent(current === "X" ? "O" : "X");

    if (nextWinner) {
      saveScores({ ...scores, [nextWinner.player]: scores[nextWinner.player] + 1 });
    } else if (nextDraw) {
      saveScores({ ...scores, draws: scores.draws + 1 });
    }
  }

  function newRound() {
    setBoard(EMPTY_BOARD);
    setCurrent(winner ? winner.player : current);
  }

  function resetScores() {
    const empty = { X: 0, O: 0, draws: 0 };
    setScores(empty);
    localStorage.setItem(SCORE_KEY, JSON.stringify(empty));
    setBoard(EMPTY_BOARD);
    setCurrent("X");
  }

  const status = winner
    ? `Player ${winner.player} wins`
    : isDraw
      ? "It's a draw"
      : `Player ${current}'s turn`;

  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-6">
      <div className="grid grid-cols-3 gap-3">
        <ScoreCard label="Player X" value={scores.X} accent="text-sky-300" />
        <ScoreCard label="Draws" value={scores.draws} accent="text-amber-200" />
        <ScoreCard label="Player O" value={scores.O} accent="text-rose-300" />
      </div>

      <p
        className="rounded-full bg-white/8 px-4 py-2 text-center text-sm font-medium tracking-wide text-zinc-100"
        aria-live="polite"
      >
        {status}
      </p>

      <div
        className="grid grid-cols-3 gap-2 rounded-3xl bg-zinc-950/60 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
        role="grid"
        aria-label="Tic tac toe board"
      >
        {board.map((cell, index) => {
          const winning = winner?.line.includes(index);
          return (
            <button
              key={index}
              type="button"
              role="gridcell"
              aria-label={cell ? `Cell ${index + 1}, ${cell}` : `Cell ${index + 1}, empty`}
              disabled={gameOver || Boolean(cell)}
              onClick={() => handleMove(index)}
              className={`flex aspect-square items-center justify-center rounded-2xl text-5xl font-black transition ${
                winning
                  ? "bg-emerald-400/20 text-emerald-300 ring-2 ring-emerald-300/70"
                  : "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 disabled:hover:bg-zinc-800"
              } ${cell === "X" ? "text-sky-300" : cell === "O" ? "text-rose-300" : ""}`}
            >
              {cell}
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={newRound}
          className="flex-1 rounded-full bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
        >
          New round
        </button>
        <button
          type="button"
          onClick={resetScores}
          className="flex-1 rounded-full border border-white/15 bg-transparent px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/8"
        >
          Reset scores
        </button>
      </div>
    </section>
  );
}

function ScoreCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4 text-center">
      <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}
