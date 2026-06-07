import { notFound } from "next/navigation";
import PageShell from "@/components/layout/page-shell";
import GameSession from "@/components/competition/GameSessionPage/gameSession";

type GameSessionPageProps = {
  params: {
    radioId: string;
    sessionId: string;
  };
};

// Speeds in words per minute (WPM)
const RADIO_SPEEDS: Record<string, number> = {
  "01": 5,
  "02": 10,
  "03": 15,
};

export default function GameSessionPage({ params }: GameSessionPageProps) {
  const speedWpm = RADIO_SPEEDS[params.radioId];

  if (!speedWpm) {
	//une fonction fournie par Next.js ==> afficher une page 404
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
