"use client";

import { FormEvent, useState } from "react";
import type { RegisterFormData } from "@/types/auth";
import { Button, Card, Input } from "@/components/ui";
import styles from "./register-form.module.css";

export default function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof RegisterFormData, value: string) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function validateForm() {
    if (!formData.username.trim()) {
      return "Name is required.";
    }

    if (!formData.email.trim()) {
      return "Email is required.";
    }

    if (!formData.password) {
      return "Password is required.";
    }

    if (formData.password.length < 8) {
      return "Password must be at least 8 characters long.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
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

      // ! yren: connect this register form to the real API.
      // ! after auth / Prisma fields are confirmed.
      // ! Expected fields from front for now: username, email, password.
      // ! Please confirm whether backend expects username or name.
      //
      // Example:
      // const response = await fetch("/api/auth/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     username: formData.username,
      //     email: formData.email,
      //     password: formData.password,
      //   }),
      // });

      await new Promise((resolve) => setTimeout(resolve, 600));

      setSuccess("Registration form submitted successfully.");
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (submitError) {
      console.error(submitError);
      setError("Something went wrong during registration.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card size="narrow">
      <h1 className={styles.title}>Register</h1>

      <p className={styles.description}>
        Create your account to access the platform.
      </p>

      <form onSubmit={handleSubmit}>
        <div className={styles.fields}>
          <Input
            label={
              <>
                Name <span className={styles.required}>*</span>
              </>
            }
            type="text"
            value={formData.username}
            onChange={(event) => updateField("username", event.target.value)}
            placeholder="Enter your name"
          />

          <Input
            label={
              <>
                Email <span className={styles.required}>*</span>
              </>
            }
            type="email"
            value={formData.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="Enter your email"
          />

          <Input
            label={
              <>
                Password <span className={styles.required}>*</span>
              </>
            }
            type="password"
            value={formData.password}
            onChange={(event) => updateField("password", event.target.value)}
            placeholder="Enter your password"
            hint="Password must contain at least 8 characters."
          />

          <Input
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(event) =>
              updateField("confirmPassword", event.target.value)
            }
            placeholder="Confirm your password"
          />
        </div>

        {error ? <p className={styles.error}>{error}</p> : null}

        {success ? <p className={styles.success}>{success}</p> : null}

        <div className={styles.submitArea}>
          <Button type="submit" disabled={isSubmitting} fullWidth>
            {isSubmitting ? "Submitting..." : "Create account"}
          </Button>
        </div>
      </form>
    </Card>
  );
}