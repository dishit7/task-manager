import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import type React from "react";
import { ProjectModal } from "@/components/modals/CreateProjectModal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Providers } from "../providers/providers";
import { ModalProvider } from "@/providers/modal-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PlanWise - Personal Task Management",
  description: "Streamline your life with PlanWise, the ultimate personal task management app.",
};

// Create a QueryClient instance
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Wrap the entire app with QueryClientProvider */}
        <Providers>
 
          {/* ThemeProvider for light/dark mode */}
          <ModalProvider />
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <ProjectModal />
          </ThemeProvider>
          </Providers>
       </body>
    </html>
  );
}