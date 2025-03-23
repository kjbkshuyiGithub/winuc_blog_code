'use client';

import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider } from './providers/AuthProvider';
import CodeHighlightProvider from './providers/CodeHighlightProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <CodeHighlightProvider>
          {children}
        </CodeHighlightProvider>
      </ThemeProvider>
    </AuthProvider>
  );
} 