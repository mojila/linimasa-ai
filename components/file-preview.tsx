"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface FilePreviewProps {
  file: File
  onRemove: () => void
}

export function FilePreview({ file, onRemove }: FilePreviewProps) {
  const isImage = file.type.startsWith("image/")
  const fileSize = (file.size / 1024).toFixed(1) // Convert to KB

  return (
    <div className="flex items-center gap-2 bg-muted/50 rounded-md p-2 max-w-xs">
      <div className="flex-shrink-0">
        {isImage ? (
          <div className="relative h-10 w-10 rounded-md overflow-hidden">
            <Image
              src={URL.createObjectURL(file) || "/placeholder.svg"}
              alt={file.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
            {file.name.split(".").pop()?.toUpperCase() || "FILE"}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">{fileSize} KB</p>
      </div>
      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={onRemove}>
        <X className="h-3 w-3" />
        <span className="sr-only">Remove file</span>
      </Button>
    </div>
  )
}
