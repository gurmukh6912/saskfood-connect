import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { NavHeader } from "@/components/ui/nav-header";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/components/auth-provider";
import { Wagmi } from '@/components/wagmi/wagmi';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SaskFood Connect',
  description: 'Food delivery platform connecting restaurants, drivers, and customers in Saskatchewan',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Wagmi>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NavHeader />
              {children}
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </Wagmi>
      </body>
    </html>
  );
}