"use client"

import { useState, useCallback } from "react"
import { Upload, FileText, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
    onFileSelect: (file: File) => void
    selectedFile: File | null
    onClear: () => void
}

export function FileUpload({ onFileSelect, selectedFile, onClear }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false)

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }, [])

    const handleDragIn = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true)
        }
    }, [])

    const handleDragOut = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            setIsDragging(false)

            const files = e.dataTransfer.files
            if (files && files.length > 0) {
                const file = files[0]
                if (file.type === "application/pdf") {
                    onFileSelect(file)
                }
            }
        },
        [onFileSelect]
    )

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            const file = files[0]
            if (file.type === "application/pdf") {
                onFileSelect(file)
            }
        }
    }

    return (
        <div className="w-full">
            {!selectedFile ? (
                <div
                    onDragEnter={handleDragIn}
                    onDragLeave={handleDragOut}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={cn(
                        "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer hover:border-primary/50 hover:bg-accent/50",
                        isDragging ? "border-primary bg-accent" : "border-muted-foreground/25"
                    )}
                >
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileInput}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center gap-3 text-center">
                        <div className="p-4 rounded-full bg-primary/10">
                            <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">
                                Drop your CV here or click to browse
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                PDF files only
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-3 p-4 rounded-xl border bg-accent/50">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                    </div>
                    <button
                        onClick={onClear}
                        className="p-1 rounded-md hover:bg-destructive/10 transition-colors"
                    >
                        <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </button>
                </div>
            )}
        </div>
    )
}
