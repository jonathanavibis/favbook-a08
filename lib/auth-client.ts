import { createAuthClient } from "better-auth/react";

const getClientBaseUrl = () => {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || "https://bookhive-a08.vercel.app";
};

export const authClient = createAuthClient({
  baseURL: getClientBaseUrl(),
});

export const { signIn, signUp, useSession, signOut } = authClient;
