'use client';

import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { AnimatePresence } from 'framer-motion';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AnimatePresence mode="wait" initial={false}>
          {children}
        </AnimatePresence>
      </ThemeProvider>
    </SessionProvider>
  );
} 