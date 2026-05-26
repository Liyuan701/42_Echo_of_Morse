import { notFound } from "next/navigation";
import PageShell from "@/components/layout/page-shell";
import PracticeSession from "@/components/learning/Practice/practiceSession";
import styles from "@/components/learning/css/Learning.module.css";

type PracticePageProps = {
	params: {
		levelId: string;
	};
};

export default function PracticePage({ params }: PracticePageProps) {
	const levelId = Number(params.levelId);

	if (!Number.isInteger(levelId) || levelId < 1 || levelId > 12) {
		notFound();
	}

	return (
		<main id="main-content">
			<PageShell>
				<section className={styles.learningPage}>
					<div className={styles.learningContainer}>
						<PracticeSession levelId={levelId} />
					</div>
				</section>
			</PageShell>
		</main>
	);
}
