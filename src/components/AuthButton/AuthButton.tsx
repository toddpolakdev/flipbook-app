"use client";

import { Button } from "@mantine/core";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <p>Signed in as {session.user?.email}</p>
        <Button onClick={() => signOut()}>Sign out</Button>
      </div>
    );
  }
  return <Button onClick={() => signIn("google")}>Sign in with Google</Button>;
}
