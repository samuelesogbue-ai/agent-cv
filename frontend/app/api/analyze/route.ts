import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
    try {
        console.log("=== API Route Called ===")
        const formData = await request.formData()
        const file = formData.get("cv") as File
        const jobDescription = formData.get("job_description") as string

        console.log("File received:", file?.name, file?.size)
        console.log("Job description length:", jobDescription?.length)

        if (!file || !jobDescription) {
            return NextResponse.json(
                { error: "Missing CV or job description" },
                { status: 400 }
            )
        }

        // Get backend URL from environment or use localhost
        const backendUrl = process.env.BACKEND_URL || "http://localhost:8000"
        console.log("Backend URL:", backendUrl)

        // Send PDF file directly to FastAPI backend
        console.log("Sending file to FastAPI...")
        const backendFormData = new FormData()
        backendFormData.append("cv", file)
        backendFormData.append("job_description", jobDescription)

        const response = await fetch(`${backendUrl}/analyze`, {
            method: "POST",
            body: backendFormData,
        })

        console.log("FastAPI response status:", response.status)
        console.log("FastAPI response headers:", Object.fromEntries(response.headers.entries()))

        if (!response.ok) {
            const errorText = await response.text()
            console.error("Backend error response:", errorText)
            return NextResponse.json(
                { error: `Backend analysis failed: ${errorText}` },
                { status: response.status }
            )
        }

        const contentType = response.headers.get("content-type")
        console.log("Response content-type:", contentType)

        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text()
            console.error("Non-JSON response:", text.substring(0, 200))
            return NextResponse.json(
                { error: "Backend returned non-JSON response" },
                { status: 500 }
            )
        }

        const result = await response.json()
        console.log("Success! Result:", JSON.stringify(result).substring(0, 100))
        return NextResponse.json(result)
    } catch (error) {
        console.error("Analysis error:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Analysis failed" },
            { status: 500 }
        )
    }
}
