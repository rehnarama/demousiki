"use client";
import { Session } from "next-auth";
import { SessionProvider as NextSessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";

export interface SessionProviderProps extends PropsWithChildren {
  session: Session | null;
}

export const SessionProvider = ({
  children,
  session,
}: SessionProviderProps) => {
  return (
    <NextSessionProvider session={session}>{children}</NextSessionProvider>
  );
};
