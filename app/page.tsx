"use client";

import { Toaster } from "sonner";
import RegistrationForm from "@/components/RegistrationForm";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-accent/20 via-background to-secondary/10">
      <RegistrationForm />
      <Toaster
        position="top-right"
        richColors
        theme="light"
        expand
        visibleToasts={3}
      />
    </main>
  );
}
