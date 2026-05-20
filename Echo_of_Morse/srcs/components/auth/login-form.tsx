"use client";

import type { LoginFormData } from "@/types/auth";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button, Card, Input } from "@/components/ui";
import styles from "./login-form.module.css";

//----------------- yren -----------------
import { signIn } from "next-auth/react";		//Les outils client React fournis par NextAuth
import { useRouter } from "next/navigation";
//----------------- yren -----------------

export default function LoginForm() {
	//----------------- yren -----------------
	const router = useRouter(); //useRouter() = outil de next.js pour sauter à une autre page
	//----------------- yren -----------------

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

	//----------------- yren -----------------
	//envoyer au auth API route pour vérifier les credentials
	const result = await signIn("credentials", {
		email: formData.email,
		password: formData.password,
		redirect: false, //change pas lorsque login réussi
	});
	
	if (result?.error) {
		setError("Invalid email or password.");
		return;
	}
	
	//redirection après login réussi
	setSuccess("Login successful.");
	router.push("/"); //redirection vers dashboard après login réussi
	router.refresh();
	//----------------- yren -----------------

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

        <Button
			type="button"
			variant="secondary"
			onClick={() => signIn("google", { callbackUrl: "/" },  { prompt: "select_account" })}
		>
			Login with Google
		</Button>

        <Button
			type="button"
			variant="secondary"
			onClick={() => signIn("42-school", { callbackUrl: "/" })}
		>
			Login with 42
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

// ! i18n: move login form titles, descriptions, labels, placeholders, validation messages, success/error messages, and links into the i18n dictionary.