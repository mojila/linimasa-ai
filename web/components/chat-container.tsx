"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Send, Paperclip, Bot } from "lucide-react"
import { FilePreview } from "@/components/file-preview"
import { MessageAttachment } from "@/components/message-attachment"
import ProjectTimeline from "./gantt-chart"

interface ChatContainerProps {
  roomId?: string
}

interface MessageWithAttachment {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  attachment?: {
    name: string
    type: string
    size: number
    url: string
  }
}

export function ChatContainer({ roomId = "" }: ChatContainerProps) {
  const [messages, setMessages] = useState<MessageWithAttachment[]>([
    {
      id: "1",
      role: "user",
      content: "Hello, AI!",
    },
    {
      id: "2",
      role: "assistant",
      content: "Hello, GC!",
    }
  ])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showTimeline, setShowTimeline] = useState(false)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const removeSelectedFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (input.trim() || selectedFile) {
      // If there's a file, add it to our messages
      if (selectedFile) {
        const fileUrl = URL.createObjectURL(selectedFile)

        // Add the file attachment to the last user message
        setTimeout(() => {
          setMessages((prev) => {
            const lastUserMessageIndex = [...prev].reverse().findIndex((m) => m.role === "user")
            if (lastUserMessageIndex >= 0) {
              const newMessages = [...prev]
              const actualIndex = prev.length - 1 - lastUserMessageIndex
              newMessages[actualIndex] = {
                ...newMessages[actualIndex],
                attachment: {
                  name: selectedFile.name,
                  type: selectedFile.type,
                  size: selectedFile.size,
                  url: fileUrl,
                },
              }
              return newMessages
            }
            return prev
          })

          // Reset file input
          setSelectedFile(null)
          if (fileInputRef.current) {
            fileInputRef.current.value = ""
          }
        }, 100)
      }
    }
  }

  const onShowTimeline = () => {
    setShowTimeline(true)
  }
  
  const onShowChat = () => {
    setShowTimeline(false)
  }

  return (
    <div className="flex flex-col h-full relative">
      {showTimeline && <div className="flex justify-center bg-primary">
        <Button className="text-white" onClick={onShowChat}>Lihat AI Chat 🤖</Button>
      </div>}
      {showTimeline && <ProjectTimeline></ProjectTimeline>}
      {!showTimeline && <div className="flex justify-center bg-primary">
        <Button className="text-white" onClick={onShowTimeline}>Lihat Timeline Project ⬇️</Button>
      </div>}
      {/* Condition to show chat or timeline project */}
      {!showTimeline && <>
        {/* Chat Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-3xl mx-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="bg-muted/50 p-6 rounded-full mb-4">
                  <Bot className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  Selamat memulai project {roomId.charAt(0).toUpperCase() + roomId.slice(1)}!
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Mulai chatting sama si lini!
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 mb-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role !== "user" && (
                    <Avatar>
                      🤖
                    </Avatar>
                  )}
                  <Card
                    className={`px-4 py-2 max-w-[80%] ${message.role === "user" ? "bg-white text-primary-foreground" : ""
                      }`}
                  >
                    <div className="text-sm">{message.content}</div>
                    {message.attachment && <MessageAttachment file={message.attachment} />}
                  </Card>
                  {message.role === "user" && (
                    <Avatar>
                      👶
                    </Avatar>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t">
          <form onSubmit={onSubmit} className="max-w-3xl mx-auto">
            {selectedFile && (
              <div className="mb-2">
                <FilePreview file={selectedFile} onRemove={removeSelectedFile} />
              </div>
            )}
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik pesan..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled
                className="px-10"
              >
                <Paperclip className="h-4 w-4" /> 🚧
                <span className="sr-only">Attach file</span>
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
              />
              <Button type="submit" className="text-white" disabled={isLoading || (!input.trim() && !selectedFile)}>
                <Send className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">Send</span>
              </Button>
            </div>
          </form>
        </div>
      </>}
    </div>
  )
}
