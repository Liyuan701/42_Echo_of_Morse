"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { morseLevels } from "@/components/learning/data/morseLevels";
import { encode } from "@/lib/morse";
import { playMorse } from "@/lib/audio";
import styles from "@/components/learning/css/Learning.module.css";

// ── Question types ────────────────────────────────────────
type QuestionMode = "MORSE_TO_LANGUAGE" | "LANGUAGE_TO_MORSE";

interface Question {
  char: string;   // the letter, e.g. "E"
  morse: string;  // the Morse code, e.g. "."
  mode: QuestionMode;
  prompt: string; // what is shown to the user
  answer: string; // correct answer (normalised to uppercase)
}

// ── Parse a newCharacters entry into char + morse ─────────
// newCharacters entries look like: ["E .", "T —", ...]
function parseChar(entry: string): { char: string; morse: string } {
  const parts = entry.trim().split(" ");
  return { char: parts[0].toUpperCase(), morse: parts.slice(1).join(" ") };
}

// ── Build the question sequence for a given level ─────────
function buildQuestions(levelId: number): Question[] {
  const level = morseLevels.find((l) => l.level === levelId);
  if (!level) return [];

  // Characters introduced in this level
  const newChars = level.newCharacters.map(parseChar);

  // Characters from all previous levels (review pool)
  const reviewChars: { char: string; morse: string }[] = [];
  for (const l of morseLevels) {
    if (l.level >= levelId) break;
    reviewChars.push(...l.newCharacters.map(parseChar));
  }

  const total = level.questionCount;
  // newRatio is stored as "60% new" — parseFloat extracts the leading number
  const newRatio = parseFloat(level.newRatio) / 100;
  const newCount = Math.round(total * newRatio);
  const reviewCount = total - newCount;

  const pool: { char: string; morse: string }[] = [];

  // Fill new-character slots (cycle through newChars if needed)
  for (let i = 0; i < newCount; i++) {
    pool.push(newChars[i % newChars.length]);
  }

  // Fill review slots
  if (reviewChars.length > 0) {
    for (let i = 0; i < reviewCount; i++) {
      pool.push(reviewChars[i % reviewChars.length]);
    }
  } else {
    // Level 1 has no review characters — fill with new chars instead
    for (let i = 0; i < reviewCount; i++) {
      pool.push(newChars[i % newChars.length]);
    }
  }

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Alternate question direction: even = decode (Morse→letter), odd = encode (letter→Morse)
  return pool.map((item, index) => {
    const mode: QuestionMode =
      index % 2 === 0 ? "MORSE_TO_LANGUAGE" : "LANGUAGE_TO_MORSE";
    return {
      char: item.char,
      morse: item.morse,
      mode,
      prompt: mode === "MORSE_TO_LANGUAGE" ? item.morse : item.char,
      answer: mode === "MORSE_TO_LANGUAGE" ? item.char : item.morse,
    };
  });
}

// ── Result screen shown after the last question ───────────
function ResultScreen({
  levelId,
  sessionCorrect,
  sessionTotal,
  leveledUp,
  newLevel,
}: {
  levelId: number;
  sessionCorrect: number;
  sessionTotal: number;
  leveledUp: boolean;
  newLevel?: number;
}) {
  const router = useRouter();
  const accuracy = Math.round((sessionCorrect / sessionTotal) * 100);

  return (
    <div className={styles.learningContainer}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          {leveledUp ? "Level up! 🎉" : "Practice complete"}
        </h1>
        <p className={styles.description}>
          {sessionCorrect} / {sessionTotal} correct — {accuracy}%
        </p>
        {leveledUp && newLevel && (
          <p className={styles.description}>
            You unlocked Level {newLevel}!
          </p>
        )}
      </section>

      <div className={styles.entryGrid}>
        <button
          className={styles.primaryButton}
          onClick={() => router.refresh()}
        >
          Try again
        </button>
        <Link className={styles.primaryButton} href="/learning/levels">
          Back to levels
        </Link>
      </div>
    </div>
  );
}

// ── Main practice page ────────────────────────────────────
export default function PracticePage() {
  const params = useParams();
  const levelId = parseInt(params.levelId as string, 10);

  const [questions, setQuestions]           = useState<Question[]>([]);
  const [current, setCurrent]               = useState(0);
  const [input, setInput]                   = useState("");
  const [feedback, setFeedback]             = useState<"correct" | "wrong" | null>(null);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [done, setDone]                     = useState(false);
  const [leveledUp, setLeveledUp]           = useState(false);
  const [newLevel, setNewLevel]             = useState<number | undefined>();
  const [isSubmitting, setIsSubmitting]     = useState(false);

  // Generate questions once on mount
  useEffect(() => {
    setQuestions(buildQuestions(levelId));
  }, [levelId]);

  const currentQuestion = questions[current];
  const isLastQuestion  = current === questions.length - 1;

  // Play the Morse audio for the current character
  const handlePlay = useCallback(async () => {
    if (!currentQuestion) return;
    await playMorse(encode(currentQuestion.char));
  }, [currentQuestion]);

  // Submit the current answer, update DB, then advance
  const handleSubmit = useCallback(async () => {
    if (!currentQuestion || isSubmitting) return;

    const correct =
      input.trim().toUpperCase() === currentQuestion.answer.toUpperCase();
    const nextCorrect = sessionCorrect + (correct ? 1 : 0);

    setFeedback(correct ? "correct" : "wrong");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/learning/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          levelId,
          char: currentQuestion.char,
          correct,
          isLastQuestion,
          sessionCorrect: nextCorrect,
          sessionTotal: current + 1,
        }),
      });

      const data = await res.json();

      if (correct) setSessionCorrect(nextCorrect);

      // Show feedback briefly, then move to next question or finish
      setTimeout(() => {
        setFeedback(null);
        setInput("");
        setIsSubmitting(false);

        if (isLastQuestion) {
          setLeveledUp(data.leveledUp ?? false);
          setNewLevel(data.newLevel);
          setDone(true);
        } else {
          setCurrent((c) => c + 1);
        }
      }, 800);
    } catch {
      setIsSubmitting(false);
      setFeedback(null);
    }
  }, [currentQuestion, input, isSubmitting, isLastQuestion, levelId, current, sessionCorrect]);

  // Allow submitting with the Enter key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter" && !isSubmitting && input.trim()) {
        handleSubmit();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSubmit, isSubmitting, input]);

  // Questions not yet generated
  if (questions.length === 0) {
    return (
      <main id="main-content">
        <div className={styles.learningContainer}>
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  // Results screen
  if (done) {
    return (
      <main id="main-content">
        <ResultScreen
          levelId={levelId}
          sessionCorrect={sessionCorrect}
          sessionTotal={questions.length}
          leveledUp={leveledUp}
          newLevel={newLevel}
        />
      </main>
    );
  }

  return (
    <main id="main-content">
      <div className={styles.learningContainer}>

        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link className={styles.link} href="/learning">Learning</Link>
          <span aria-hidden="true"> / </span>
          <Link className={styles.link} href="/learning/levels">Levels</Link>
          <span aria-hidden="true"> / </span>
          <span className={styles.breadcrumbCurrent}>Level {levelId}</span>
        </nav>

        {/* Progress indicator */}
        <p className={styles.eyebrow}>
          {current + 1} / {questions.length}
        </p>

        {/* Question */}
        <section className={styles.hero}>
          <p className={styles.cardLabel}>
            {currentQuestion.mode === "MORSE_TO_LANGUAGE"
              ? "What letter is this?"
              : "Encode this letter in Morse"}
          </p>
          <h1 className={styles.title}>{currentQuestion.prompt}</h1>
        </section>

        {/* Audio button — only shown for decode questions */}
        {currentQuestion.mode === "MORSE_TO_LANGUAGE" && (
          <button
            type="button"
            className={styles.primaryButton}
            onClick={handlePlay}
          >
            Play audio
          </button>
        )}

        {/* Answer input */}
        <div className={styles.entryCard}>
          <input
            className={styles.input ?? ""}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              currentQuestion.mode === "MORSE_TO_LANGUAGE"
                ? "Type the letter"
                : "Type the Morse code (e.g. . — . .)"
            }
            disabled={isSubmitting}
            autoFocus
          />

          {/* Inline correct / wrong feedback */}
          {feedback && (
            <p
              style={{
                color: feedback === "correct"
                  ? "var(--color-text-success)"
                  : "var(--color-text-danger)",
                fontWeight: 500,
                marginTop: 8,
              }}
            >
              {feedback === "correct"
                ? `✓ Correct`
                : `✗ Answer: ${currentQuestion.answer}`}
            </p>
          )}

          <button
            type="button"
            className={styles.primaryButton}
            onClick={handleSubmit}
            disabled={isSubmitting || !input.trim()}
            style={{ marginTop: 12 }}
          >
            Submit
          </button>
        </div>

        {/* Live score */}
        <p className={styles.cardLabel}>
          Score: {sessionCorrect} / {current + (feedback ? 1 : 0)} correct
        </p>

      </div>
    </main>
  );
}
