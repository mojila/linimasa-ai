import type React from "react"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata = {
    title: "Linimasa.ai - Login",
    description: "Login to Linimasa.ai",
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-background min-h-screen">
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
                {children}
            </ThemeProvider>
        </div>
    )
}