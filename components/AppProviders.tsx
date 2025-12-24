"use client";

import Providers from "@/app/providers";
import { AlertModalProvider } from "@/context/AlertModalContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AlertModalProvider>
      <Providers>{children}</Providers>
    </AlertModalProvider>
  );
}
