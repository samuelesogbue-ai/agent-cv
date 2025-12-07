"use client"

import { useState } from "react"
import { FileUpload } from "@/components/file-upload"
import { ChatInterface } from "@/components/chat-interface"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnalysisResponse } from "@/types"
import { Sparkles, Briefcase } from "lucide-react"

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!selectedFile || !jobDescription.trim()) {
      setError("Please upload your CV and enter a job description")
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("cv", selectedFile)
      formData.append("job_description", jobDescription)

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Analysis failed")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearFile = () => {
    setSelectedFile(null)
    setResult(null)
    setError(null)
  }

  const handleReset = () => {
    setSelectedFile(null)
    setJobDescription("")
    setResult(null)
    setError(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Career Coach AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your CV and paste a job description to get an AI-powered match analysis and personalized learning recommendations
          </p>
        </div>

        {/* Input Section */}
        {!result && (
          <div className="max-w-3xl mx-auto space-y-6 mb-12">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Your Information
                </CardTitle>
                <CardDescription>
                  Upload your CV and provide the job description you&apos;re interested in
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">CV (PDF)</label>
                  <FileUpload
                    onFileSelect={setSelectedFile}
                    selectedFile={selectedFile}
                    onClear={handleClearFile}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Description</label>
                  <Textarea
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                </div>

                {error && (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handleAnalyze}
                  disabled={!selectedFile || !jobDescription.trim() || isLoading}
                  className="w-full h-12 text-base"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Analyze Match
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Section */}
        <ChatInterface result={result} isLoading={isLoading} />

        {/* Reset Button */}
        {result && (
          <div className="max-w-3xl mx-auto mt-8 text-center">
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
            >
              Analyze Another Position
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
