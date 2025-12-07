from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from workflows.matching_flow import app as graph_app
from langchain_core.messages import HumanMessage, ToolMessage
import re
import ast
import PyPDF2
import io

# Define the Input Schema (What the frontend sends us)
class RequestBody(BaseModel):
    resume: str
    job_description: str

# Initialize FastAPI
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Career Coach AI is running!"}

def parse_response(final_response: str, messages: list) -> dict:
    """Parse the agent response into structured JSON"""
    # Extract score (e.g., "60%", "85%")
    score_match = re.search(r'(\d+)%', final_response)
    score = int(score_match.group(1)) if score_match else 0
    
    # Extract reason - the full explanation text
    reason = final_response.strip()
    
    # Extract videos from tool results in message history
    videos = []
    for msg in messages:
        if isinstance(msg, ToolMessage):
            try:
                # Parse the string representation of the list from tool result
                video_data = ast.literal_eval(msg.content)
                if isinstance(video_data, list):
                    videos = [
                        {
                            "title": v.get("title", ""),
                            "video": v.get("link", ""),
                            "thumbnail": v.get("thumbnail", "")
                        }
                        for v in video_data if isinstance(v, dict) and v.get("link")
                    ]
                    if videos:
                        break
            except (ValueError, SyntaxError):
                # If parsing fails, try extracting from text response
                pass
    
    # If no videos from tool results, try parsing from text response
    if not videos:
        video_pattern = r'\*\s*([^\n]+?):\s*(https://www\.youtube\.com/watch\?v=[^\s]+)'
        matches = re.findall(video_pattern, final_response)
        for title, link in matches:
            videos.append({
                "title": title.strip(),
                "video": link,
                "thumbnail": ""  # Thumbnail not available from text parsing
            })
    
    return {
        "match_score": score,
        "reason": reason,
        "learning_plan": videos
    }

@app.post("/analyze")
async def analyze_career(cv: UploadFile = File(...), job_description: str = Form(...)):
    """
    Endpoint that triggers the Agent Workflow.
    Accepts a PDF file and job description.
    """
    try:
        # Read and extract text from PDF
        pdf_bytes = await cv.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
        
        # Extract text from all pages
        resume_text = ""
        for page in pdf_reader.pages:
            resume_text += page.extract_text()
        
        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        
        # Create the initial prompt for the agent
        initial_prompt = (
            f"Here is a Job Description: {job_description} \n\n"
            f"Here is a Resume: {resume_text} \n\n"
            "Step 1: Compare them and calculate a percentage match score. "
            "Step 2: If the score is under 100%, identify the TOP missing skill. "
            "Step 3: Use the video tool to find 3 specific YouTube videos for that missing skill. "
            "Step 4: Final output should be the Score, the Reasoning, and the Video Links."
        )
        
        inputs = {"messages": [HumanMessage(content=initial_prompt)]}
        
        # Run the graph (invoke waits for the whole chain to finish)
        result = graph_app.invoke(inputs)
        
        # Extract the final message content
        final_response = result["messages"][-1].content
        
        # Parse and structure the response
        structured_response = parse_response(final_response, result["messages"])
        
        return structured_response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))