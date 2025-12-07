# Career Coach AI - Quick Start Guide

## 🚀 Running the Application

### Backend (FastAPI)
```bash
cd /Users/admin/Projects/cv-agent-2
uvicorn api.index:app --reload
```
✅ Backend running at: http://localhost:8000

### Frontend (Next.js)
```bash
cd /Users/admin/Projects/cv-agent-2/frontend
pnpm dev
```
✅ Frontend running at: http://localhost:3000

## 📝 How to Use

1. **Open the app**: Navigate to http://localhost:3000
2. **Upload your CV**: Drag and drop a PDF file or click to browse
3. **Paste job description**: Enter the complete job description
4. **Click "Analyze Match"**: Wait for AI processing
5. **View results**: See your match score and learning recommendations

## 🔧 Recent Fixes

### CORS Issue Fixed ✅
Added CORS middleware to FastAPI backend to allow requests from Next.js frontend:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Enhanced Error Logging ✅
Added comprehensive logging to the API route for easier debugging. Check the terminal running `pnpm dev` to see detailed logs.

## 🐛 Troubleshooting

### "Unexpected token '<'" Error
This was caused by missing CORS middleware. **Fixed!** ✅

### Check Logs
- **Frontend logs**: Terminal running `pnpm dev`
- **Backend logs**: Terminal running `uvicorn`

### Test Backend Directly
```bash
curl http://localhost:8000/
# Should return: {"message":"Career Coach AI is running!"}
```

## 📦 Environment Variables

Create/edit `frontend/.env.local`:
```env
BACKEND_URL=http://localhost:8000
```

For production, change to your deployed FastAPI URL.

## 🚢 Deployment

### Deploy Frontend to Vercel
```bash
cd frontend
vercel
```

### Deploy Backend
Options:
- Vercel (Python serverless functions)
- Railway
- Render
- AWS Lambda
- Google Cloud Run

Update `BACKEND_URL` in Vercel environment variables after deploying backend.

## 📚 Tech Stack

- **Frontend**: Next.js 16, TypeScript, shadcn/ui, Tailwind CSS
- **Backend**: FastAPI, LangChain, OpenAI
- **Deployment**: Vercel (recommended)

## 🎨 Features

- ✅ Beautiful Claude-style UI
- ✅ Drag-and-drop PDF upload
- ✅ Real-time AI analysis
- ✅ Match score visualization
- ✅ Personalized learning recommendations
- ✅ Responsive design
- ✅ Smooth animations

---

**Need help?** Check the walkthrough for detailed documentation.
