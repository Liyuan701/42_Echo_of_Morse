"use client";

import type { LoginFormData } from "@/types/auth";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button, Card, Input } from "@/components/ui";
import styles from "./login-form.module.css";

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof LoginFormData, value: string) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function validateForm() {
    if (!formData.email.trim()) {
      return "Email is required.";
    }

    if (!formData.password) {
      return "Password is required.";
    }

    return "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);

      // ! yren: connect this login form to auth.
      // If we keep NextAuth, this should probably use signIn("credentials", { email, password }).

      await new Promise((resolve) => setTimeout(resolve, 600));

      setSuccess("Login form submitted successfully.");
      setFormData({
        email: "",
        password: "",
      });
    } catch (submitError) {
      console.error(submitError);
      setError("Something went wrong during login.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card size="narrow">
      <h1 className={styles.title}>Login</h1>

      <p className={styles.description}>
        Sign in to continue to your account.
      </p>

     <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fields}>
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="Enter your email"
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(event) => updateField("password", event.target.value)}
            placeholder="Enter your password"
          />
        </div>

        {error ? <p className={styles.error}>{error}</p> : null}

        {success ? <p className={styles.success}>{success}</p> : null}

        <Button type="submit" disabled={isSubmitting} fullWidth>
          {isSubmitting ? "Submitting..." : "Login"}
        </Button>
      </form>

      <p className={styles.registerText}>
        Don&apos;t have an account?{" "}
        <Link className={styles.registerLink} href="/register">
          Register here
        </Link>
      </p>
    </Card>
  );
}