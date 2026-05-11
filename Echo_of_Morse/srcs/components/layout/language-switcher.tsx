"use client";

import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui";
import styles from "./language-switcher.module.css";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <div className={styles.switcher} aria-label="Language switcher">
      <Button
        type="button"
        size="sm"
        variant={language === "en" ? "primary" : "secondary"}
        onClick={() => setLanguage("en")}
        className={styles.button}
      >
        EN
      </Button>

      <Button
        type="button"
        size="sm"
        variant={language === "fr" ? "primary" : "secondary"}
        onClick={() => setLanguage("fr")}
        className={styles.button}
      >
        FR
      </Button>

      <Button
        type="button"
        size="sm"
        variant={language === "zh" ? "primary" : "secondary"}
        onClick={() => setLanguage("zh")}
        className={styles.button}
      >
        中文
      </Button>
    </div>
  );
}
// ! i18n: move all navigation labels, aria-labels, footer links, and footer description into the i18n dictionary.
// ! i18n: keep the brand name "Echoes of Morse" unchanged unless the team decides to translate the product name.