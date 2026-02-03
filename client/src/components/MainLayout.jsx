import React from 'react';
import Navbar from './Navbar';
import { Toaster } from "@/components/ui/sonner";

const MainLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with MERN Stack & Shadcn UI. Modern Blog Application.
          </p>
        </div>
      </footer>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
};

export default MainLayout;
