import type { MorseLevel, UserLearningProgress } from "@/types/learning";
import LevelCard from "@/components/learning/LevelCard";
import styles from "@/components/learning/css/Learning.module.css";

type LevelGridProps = {
  levels: MorseLevel[];
  progress: UserLearningProgress;
};

export default function LevelGrid({ levels, progress }: LevelGridProps) {
  return (
    <div className={styles.levelGrid} aria-label="Morse levels">
      {levels.map((level) => (
        <LevelCard key={level.level} level={level} progress={progress} />
      ))}
    </div>
  );
}