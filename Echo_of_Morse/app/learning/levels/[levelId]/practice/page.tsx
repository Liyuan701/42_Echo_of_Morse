import Link from "next/link";
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
						<nav className={styles.breadcrumb} aria-label="Breadcrumb">
							<Link className={styles.link} href="/learning">
								Learning
							</Link>
							<span aria-hidden="true"> / </span>
							<Link className={styles.link} href="/learning/levels">
								Levels
							</Link>
							<span aria-hidden="true"> / </span>
							<span className={styles.breadcrumbCurrent}>
								Level {levelId} practice
							</span>
						</nav>

						<PracticeSession levelId={levelId} />
					</div>
				</section>
			</PageShell>
		</main>
	);
}
