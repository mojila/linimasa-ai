"use client"

import { FileIcon, ImageIcon, FileTextIcon, FileArchiveIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface MessageAttachmentProps {
  file: {
    name: string
    type: string
    size: number
    url: string
  }
}

export function MessageAttachment({ file }: MessageAttachmentProps) {
  const isImage = file.type.startsWith("image/")
  const fileSize = (file.size / 1024).toFixed(1) // Convert to KB

  const getFileIcon = () => {
    if (file.type.includes("pdf")) return <FileTextIcon className="h-4 w-4" />
    if (file.type.includes("zip") || file.type.includes("rar")) return <FileArchiveIcon className="h-4 w-4" />
    return <FileIcon className="h-4 w-4" />
  }

  if (isImage) {
    return (
      <div className="mt-2 mb-1">
        <div className="relative h-48 w-full max-w-xs rounded-md overflow-hidden">
          <Image src={file.url || "/placeholder.svg"} alt={file.name} fill className="object-contain" />
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          <ImageIcon className="h-3 w-3" />
          <span>{file.name}</span>
          <span>({fileSize} KB)</span>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-2 mb-1">
      <Button
        variant="outline"
        className="h-auto py-2 px-3 flex items-center gap-2 w-full max-w-xs justify-start"
        onClick={() => window.open(file.url, "_blank")}
      >
        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary">
          {getFileIcon()}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-xs font-medium truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">{fileSize} KB</p>
        </div>
      </Button>
    </div>
  )
}
