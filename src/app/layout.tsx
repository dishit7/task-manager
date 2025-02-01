import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import type React from "react"  
import { ProjectModal } from "@/components/modals/ProjectModal"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PlanWise - Personal Task Management",
  description: "Streamline your life with PlanWise, the ultimate personal task management app.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
           {children}
        </ThemeProvider>
                <ProjectModal />

      </body>
    </html>
  )
}

