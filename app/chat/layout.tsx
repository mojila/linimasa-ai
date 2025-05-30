import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { UserProfile } from "@/components/user-profile"

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <UserProfile />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  )
}
