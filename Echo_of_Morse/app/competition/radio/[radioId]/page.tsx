import { notFound } from "next/navigation";
import PageShell from "@/components/layout/page-shell";
import RadioLobbyClient from "@/components/competition/RadioLobbyPage/RadioLobbyClient";
import {
  getRadioConfig,
  isValidRadioId,
} from "@/components/competition/mockData/mockCompetitionData";

type RadioLobbyPageProps = {
  params: {
    radioId: string;
  };
};

export default function RadioLobbyPage({ params }: RadioLobbyPageProps) {
  const { radioId } = params;

  if (!isValidRadioId(radioId)) {
    notFound();
  }

  const radio = getRadioConfig(radioId);

  return (
    <main id="main-content">
      <PageShell>
        <RadioLobbyClient radio={radio} />
      </PageShell>
    </main>
  );
}