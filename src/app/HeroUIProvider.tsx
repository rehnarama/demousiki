"use client";
import { HeroUIProvider as InternalHeroUIProvider } from "@heroui/react";

import { PropsWithChildren } from "react";

export const HeroUIProvider = ({ children }: PropsWithChildren) => {
  return <InternalHeroUIProvider>{children}</InternalHeroUIProvider>;
};
