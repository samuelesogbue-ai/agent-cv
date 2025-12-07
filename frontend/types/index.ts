export interface VideoRecommendation {
    title: string;
    video: string;
    thumbnail: string;
}

export interface AnalysisResponse {
    match_score: number;
    reason: string;
    learning_plan: VideoRecommendation[];
}

export interface AnalysisRequest {
    resume: string;
    job_description: string;
}
