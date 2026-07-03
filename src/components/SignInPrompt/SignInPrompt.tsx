"use client";
import Link from "next/link";
import { Button } from "@mantine/core";
import { signIn } from "next-auth/react";
import { LogIn, Home } from "lucide-react";
import styles from "./SignInPrompt.module.css";

export default function SignInPrompt({
  message,
  title = "Sign in required",
  showSignIn = true,
}: {
  message: string;
  title?: string;
  showSignIn?: boolean;
}) {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.message}>{message}</p>
      {showSignIn ? (
        <Button
          onClick={() => signIn("google")}
          leftSection={<LogIn size={16} />}>
          Sign in with Google
        </Button>
      ) : (
        <Button
          component={Link}
          href="/"
          variant="light"
          leftSection={<Home size={16} />}>
          Back to home
        </Button>
      )}
    </div>
  );
}
