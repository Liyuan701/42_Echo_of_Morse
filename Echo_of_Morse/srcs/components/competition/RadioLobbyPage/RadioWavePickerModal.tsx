//! With static test data in the page.
//! mock data deleted
"use client";

import { Button } from "@/components/ui";
import type { RadioId } from "@/types/competition";
import styles from "./css/radio-wave-picker-modal.module.css";

type RadioConfig = {
  id: RadioId;
  name: string;
  wpm: number;
  description: string;
};

// temporary UI fallback (until we wire Prisma/service layer)
const radioConfigs: RadioConfig[] = [
  { id: "01", name: "Radio 01", wpm: 20, description: "" },
  { id: "02", name: "Radio 02", wpm: 25, description: "" },
  { id: "03", name: "Radio 03", wpm: 30, description: "" },
];

type RadioWavePickerModalProps = {
  isOpen: boolean;
  targetDisplayName: string;
  onClose: () => void;
  onSelectRadio: (radioId: RadioId) => void;
};

export default function RadioWavePickerModal({
  isOpen,
  targetDisplayName,
  onClose,
  onSelectRadio,
}: RadioWavePickerModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="radio-invite-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div>
            <h2 id="radio-invite-title" className={styles.title}>
              Choose a Radio Wave
            </h2>

            <p className={styles.description}>
              Invite {targetDisplayName} to join a radio lobby.
            </p>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close radio selection"
          >
            ×
          </button>
        </header>

        <div className={styles.radioList}>
          {radioConfigs.map((radio: RadioConfig) => (
            <button
              key={radio.id}
              type="button"
              className={styles.radioOption}
              onClick={() => onSelectRadio(radio.id)}
            >
              <span className={styles.radioName}>{radio.name}</span>
              <span className={styles.radioMeta}>{radio.wpm} WPM</span>
              <span className={styles.radioDescription}>
                {radio.description}
              </span>
            </button>
          ))}
        </div>

        <footer className={styles.footer}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </footer>
      </section>
    </div>
  );
}