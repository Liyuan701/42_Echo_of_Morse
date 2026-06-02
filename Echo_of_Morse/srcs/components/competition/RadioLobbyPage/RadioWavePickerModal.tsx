"use client";

import { Button } from "@/components/ui";
import { radioConfigs } from "@/components/competition/mockData/mockCompetitionData";
import type { RadioId } from "@/types/competition";
import styles from "./css/radio-wave-picker-modal.module.css";

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
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onClick={onClose}
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="radio-invite-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div>
            {/* //! yongyue i18n: move this modal title into the i18n dictionary. */}
            <h2 id="radio-invite-title" className={styles.title}>
              Choose a Radio Wave
            </h2>

            {/* //! yongyue i18n: move this helper text into the i18n dictionary with targetDisplayName interpolation. */}
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
          {radioConfigs.map((radio) => (
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
          {/* //! yongyue i18n: move this cancel label into the i18n dictionary. */}
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </footer>
      </section>
    </div>
  );
}