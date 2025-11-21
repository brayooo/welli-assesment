"use client";

import { Toaster } from "sonner";
import RegistrationForm from "@/components/registration/RegistrationForm";


export default function NewUserPage() {
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
