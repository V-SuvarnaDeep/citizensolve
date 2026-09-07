import os
import tempfile

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client

from ai import analyze_problem
from ranking import rank_problems


# Load environment variables
load_dotenv()

# Supabase connection
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SECRET_KEY")

supabase = create_client(
    supabase_url,
    supabase_key
)


app = FastAPI(title="Civiora AI Service")


# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Civiora AI Service is running"
    }


@app.post("/analyze")
async def analyze(
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    location: str = Form(...),
    impact: str = Form(...),
    urgency: str = Form(...),
    additionalInfo: str = Form(""),
    image: UploadFile = File(...)
):
    # Create a temporary file for the uploaded image
    suffix = os.path.splitext(image.filename or "")[1] or ".jpg"

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=suffix
    ) as temp_file:

        image_data = await image.read()
        temp_file.write(image_data)
        image_path = temp_file.name

    try:
        # Send the citizen's information and image to Gemini AI
        result = analyze_problem(
            title=title,
            description=description,
            category=category,
            location=location,
            impact=impact,
            urgency=urgency,
            image_path=image_path
        )

        # Add additional information to the AI result
        result["additionalInfo"] = additionalInfo

        # Save the problem and AI analysis in Supabase
        problem_data = {
            "title": title,
            "description": description,
            "category": category,
            "location": location,
            "impact": impact,
            "urgency": urgency,
            "additional_info": additionalInfo,
            "ai_analysis": result,
            "status": "submitted"
        }

        database_response = (
            supabase
            .table("problems")
            .insert(problem_data)
            .execute()
        )

        saved_problem = database_response.data[0]

        # Automatically recalculate priority ranking
        all_problems_response = (
            supabase
            .table("problems")
            .select("*")
            .eq("status", "submitted")
            .execute()
        )

        all_problems = all_problems_response.data

        ranked_problems = rank_problems(all_problems)

        # Save the new ranks in Supabase
        for item in ranked_problems:
            (
                supabase
                .table("problems")
                .update({
                    "priority_rank": item["rank"]
                })
                .eq("id", item["id"])
                .execute()
            )

        # Find the rank of the newly submitted problem
        new_problem_rank = next(
            item["rank"]
            for item in ranked_problems
            if item["id"] == saved_problem["id"]
        )

        return {
            "success": True,
            "problem_id": saved_problem["id"],
            "priority_rank": new_problem_rank,
            "analysis": result
        }

    finally:
        # Remove temporary image after AI analysis
        if os.path.exists(image_path):
            os.remove(image_path)


@app.post("/rank")
def rank_all_problems():
    response = (
        supabase
        .table("problems")
        .select("*")
        .eq("status", "submitted")
        .execute()
    )

    problems = response.data

    ranked_problems = rank_problems(problems)

    for item in ranked_problems:
        (
            supabase
            .table("problems")
            .update({
                "priority_rank": item["rank"]
            })
            .eq("id", item["id"])
            .execute()
        )

    return {
        "success": True,
        "count": len(ranked_problems),
        "ranked_problems": [
            {
                "rank": item["rank"],
                "id": item["id"],
                "score": item["score"],
                "title": item["problem"]["title"]
            }
            for item in ranked_problems
        ]
    }
@app.get("/problems")
def get_problems():
    response = (
        supabase
        .table("problems")
        .select("*")
        .eq("status", "submitted")
        .order("priority_rank", desc=False)
        .execute()
    )

    return {
        "success": True,
        "problems": response.data
    }
@app.get("/problems/{problem_id}")
def get_problem(problem_id: str):
    response = (
        supabase
        .table("problems")
        .select("*")
        .eq("id", problem_id)
        .single()
        .execute()
    )

    return {
        "success": True,
        "problem": response.data
    }


@app.patch("/problems/{problem_id}/status")
def update_problem_status(
    problem_id: str,
    status_data: dict
):
    new_status = status_data.get("status")

    if new_status not in ["approved", "rejected"]:
        return {
            "success": False,
            "message": "Invalid status"
        }

    response = (
        supabase
        .table("problems")
        .update({
            "status": new_status
        })
        .eq("id", problem_id)
        .execute()
    )

    return {
        "success": True,
        "problem": response.data[0]
    }