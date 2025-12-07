"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AnalysisResponse } from "@/types"
import { Sparkles, GraduationCap, ExternalLink } from "lucide-react"

interface ChatInterfaceProps {
    result: AnalysisResponse | null
    isLoading: boolean
}

export function ChatInterface({ result, isLoading }: ChatInterfaceProps) {
    if (isLoading) {
        return (
            <div className="w-full max-w-3xl mx-auto">
                <Card className="border-primary/20 bg-gradient-to-br from-background to-accent/20">
                    <CardContent className="p-8">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-primary/20 animate-pulse" />
                                <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                                <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!result) {
        return null
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600"
        if (score >= 60) return "text-yellow-600"
        return "text-orange-600"
    }

    const getProgressColor = (score: number) => {
        if (score >= 80) return "bg-green-600"
        if (score >= 60) return "bg-yellow-600"
        return "bg-orange-600"
    }

    return (
        <div className="w-full max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Match Score Card */}
            <Card className="border-primary/20 bg-gradient-to-br from-background to-accent/20">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <CardTitle>Analysis Complete</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Match Score</span>
                            <span className={`text-2xl font-bold ${getScoreColor(result.match_score)}`}>
                                {result.match_score}%
                            </span>
                        </div>
                        <Progress
                            value={result.match_score}
                            className="h-3"
                            style={{
                                // @ts-ignore
                                '--progress-background': getProgressColor(result.match_score)
                            }}
                        />
                    </div>

                    <div className="pt-4 border-t">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {result.reason}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Learning Plan Card */}
            {result.learning_plan && result.learning_plan.length > 0 && (
                <Card className="border-primary/20">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-primary" />
                            <CardTitle>Recommended Learning Path</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {result.learning_plan.map((video, index) => (
                            <a
                                key={index}
                                href={video.video}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block group"
                            >
                                <div className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-all duration-200 hover:border-primary/50">
                                    {video.thumbnail && (
                                        <div className="flex-shrink-0 w-32 h-20 rounded-md overflow-hidden bg-muted">
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors">
                                                {video.title}
                                            </p>
                                            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-0.5" />
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
