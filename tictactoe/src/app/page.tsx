import TicTacToe from "@/components/TicTacToe";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <main className="flex w-full max-w-xl flex-col items-center gap-8">
        <header className="text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-zinc-400">
            Next.js
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
            Tic Tac Toe
          </h1>
          <p className="mt-3 max-w-md text-base leading-7 text-zinc-400">
            Two-player game on one page. Wins, losses, and draws stay on the
            scoreboard until you reset them.
          </p>
        </header>
        <TicTacToe />
      </main>
    </div>
  );
}
