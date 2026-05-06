"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { useId } from "react";
import styles from "./input.module.css";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
};

export default function Input({
  label,
  hint,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const inputClassNames = [
    styles.input,
    error ? styles.inputError : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={styles.field} htmlFor={inputId}>
      {label ? <span className={styles.label}>{label}</span> : null}

      <input id={inputId} className={inputClassNames} {...props} />

      {hint ? <small className={styles.hint}>{hint}</small> : null}

      {error ? <small className={styles.error}>{error}</small> : null}
    </label>
  );
}