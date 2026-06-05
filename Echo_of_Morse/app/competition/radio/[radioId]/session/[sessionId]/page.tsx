import { notFound } from "next/navigation";
import PageShell from "@/components/layout/page-shell";
import GameSession from "@/components/competition/GameSessionPage/gameSession";

type GameSessionPageProps = {
  params: {
    radioId: string;
    sessionId: string;
  };
};

const RADIO_SPEEDS: Record<string, number> = {
  "01": 8,
  "02": 12,
  "03": 16,
};

export default function GameSessionPage({ params }: GameSessionPageProps) {
  const speedWpm = RADIO_SPEEDS[params.radioId];

  if (!speedWpm) {
    notFound();
  }

  return (
    <main id="main-content">
      <PageShell>
        <GameSession
			radioId={params.radioId}
			sessionId={params.sessionId}
			speedWpm={speedWpm}
		/>
      </PageShell>
    </main>
  );
}
