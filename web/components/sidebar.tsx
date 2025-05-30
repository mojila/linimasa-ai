"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Home, MessageSquare, Zap, Sparkles, Flame, PlusCircle, Settings, MoreHorizontal, Trash2, Bot, LineChart } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Room {
  id: string
  name: string
  icon: React.ReactNode
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "linimasa",
      name: "Linimasa project",
      icon: <MessageSquare className="h-4 w-4" />,
    }
  ])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null)

  const handleDeleteRoom = (roomId: string) => {
    setRoomToDelete(roomId)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteRoom = () => {
    if (roomToDelete) {
      setRooms(rooms.filter((room) => room.id !== roomToDelete))
      setDeleteDialogOpen(false)
      setRoomToDelete(null)

      // If user is currently in the deleted room, redirect to general
      if (pathname === `/chat/${roomToDelete}`) {
        window.location.href = "/chat/linimasa"
      }
    }
  }

  return (
    <div className="w-64 border-r bg-muted/40 flex flex-col h-full">
      <div className="p-4">
        <Link href="/chat">
          <Button variant="ghost" className="w-full justify-start gap-2 mb-2 text-lg font-bold">
            <Bot className="h-5 w-5" />
            Linimasa.ai
          </Button>
        </Link>
      </div>

      <Separator className="my-2" />

      <div className="px-4 py-2">
        <h2 className="text-sm font-semibold mb-2">Daftar Projectmu</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-2">
          {rooms.map((room) => {
            const isActive = pathname === `/chat/${room.id}`
            const canDelete = room.id !== "general" // Don't allow deleting general chat

            return (
              <div
                key={room.id}
                className={cn(
                  "flex items-center rounded-md transition-colors relative group",
                  isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
                )}
              >
                <Link href={`/chat/${room.id}`} className="flex items-center gap-3 px-3 py-2 text-sm flex-1">
                  {room.icon}
                  <span>{room.name}</span>
                </Link>

                {canDelete && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 mr-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-3 w-3" />
                          <span className="sr-only">Room options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDeleteRoom(room.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </ScrollArea>

      <div className="p-4 mt-auto">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 mb-2"
          onClick={() => {
            const roomName = prompt("Masukkan nama project:")
            if (roomName) {
              const newRoomId = roomName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-*|-*$/g, "") + "-" + Date.now()
              setRooms((prevRooms) => [
                ...prevRooms,
                {
                  id: newRoomId,
                  name: roomName,
                  icon: <MessageSquare className="h-4 w-4" />,
                },
              ])
              router.push(`/chat/${newRoomId}`)
            }
          }}
        >
          <PlusCircle className="h-4 w-4" />
          Project baru
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => alert("Settings feature coming soon!")}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Beneran mau hapus project {roomToDelete}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteRoom}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
