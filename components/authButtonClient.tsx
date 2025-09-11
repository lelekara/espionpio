"use client";
import { usePathname } from "next/navigation";
import { SpyButton } from "./spy-button";

export function AuthButtonClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <>
      {children}
      {!pathname.includes("/protected") && <SpyButton />}
    </>
  );
}