import os
import tempfile

from dotenv import load_dotenv

from fastapi import (
    FastAPI,
    File,
    Form,
    Header,
    HTTPException,
    UploadFile
)

from fastapi.middleware.cors import CORSMiddleware

from supabase import create_client

from ai import analyze_problem
from ranking import rank_problems


# --------------------------------------------------
# LOAD ENVIRONMENT VARIABLES
# --------------------------------------------------

load_dotenv()


# --------------------------------------------------
# SUPABASE CONNECTION
# --------------------------------------------------

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SECRET_KEY")

supabase = create_client(
    supabase_url,
    supabase_key
)


# --------------------------------------------------
# FASTAPI APP
# --------------------------------------------------

app = FastAPI(
    title="Civiora AI Service"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# AUTHENTICATION
# --------------------------------------------------

def get_current_user(
    authorization: str | None
):

    if not authorization:

        raise HTTPException(
            status_code=401,
            detail="Authentication required"
        )

    if not authorization.startswith(
        "Bearer "
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header"
        )

    token = authorization.replace(
        "Bearer ",
        "",
        1
    )

    try:

        response = supabase.auth.get_user(
            token
        )

        if not response.user:

            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token"
            )

        return response.user

    except HTTPException:

        raise

    except Exception:

        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )


# --------------------------------------------------
# CREATE NOTIFICATION
# --------------------------------------------------

def create_notification(
    user_id,
    title,
    message,
    notification_type
):

    try:

        (
            supabase
            .table("notifications")
            .insert({
                "user_id": str(user_id),
                "title": title,
                "message": message,
                "type": notification_type
            })
            .execute()
        )

    except Exception as error:

        print(
            "Notification creation failed:",
            error
        )


# --------------------------------------------------
# HOME
# --------------------------------------------------

@app.get("/")
def home():

    return {
        "message": "Civiora AI Service is running"
    }


# --------------------------------------------------
# ANALYZE AND SUBMIT PROBLEM
# --------------------------------------------------

@app.post("/analyze")
async def analyze(

    title: str = Form(...),

    description: str = Form(...),

    category: str = Form(...),

    location: str = Form(...),

    impact: str = Form(...),

    urgency: str = Form(...),

    additionalInfo: str = Form(""),

    image: UploadFile = File(...),

    authorization: str | None = Header(
        default=None
    )

):

    # Get logged-in user

    user = get_current_user(
        authorization
    )


    # --------------------------------------------------
    # CREATE TEMPORARY IMAGE FILE
    # --------------------------------------------------

    suffix = os.path.splitext(
        image.filename or ""
    )[1] or ".jpg"

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=suffix
    ) as temp_file:

        image_data = await image.read()

        temp_file.write(
            image_data
        )

        image_path = temp_file.name


    try:

        # --------------------------------------------------
        # GEMINI AI ANALYSIS
        # --------------------------------------------------

        result = analyze_problem(

            title=title,

            description=description,

            category=category,

            location=location,

            impact=impact,

            urgency=urgency,

            image_path=image_path
        )


        # Add additional information

        result["additionalInfo"] = (
            additionalInfo
        )


        # --------------------------------------------------
        # SAVE PROBLEM
        # --------------------------------------------------

        problem_data = {

            "title": title,

            "description": description,

            "category": category,

            "location": location,

            "impact": impact,

            "urgency": urgency,

            "additional_info": additionalInfo,

            "ai_analysis": result,

            "status": "submitted",

            "user_id": str(user.id)
        }


        database_response = (

            supabase
            .table("problems")
            .insert(problem_data)
            .execute()

        )


        saved_problem = (
            database_response.data[0]
        )


        # --------------------------------------------------
        # CREATE CITIZEN NOTIFICATION
        # --------------------------------------------------

        create_notification(

            user.id,

            "Problem Submitted Successfully",

            "Your reported problem has been successfully submitted to Civiora and is now being analyzed.",

            "success"
        )


        # --------------------------------------------------
        # GET ALL SUBMITTED PROBLEMS
        # --------------------------------------------------

        all_problems_response = (

            supabase
            .table("problems")
            .select("*")
            .eq(
                "status",
                "submitted"
            )
            .execute()

        )


        all_problems = (
            all_problems_response.data
        )


        # --------------------------------------------------
        # CALCULATE PRIORITY RANKING
        # --------------------------------------------------

        ranked_problems = rank_problems(
            all_problems
        )


        # --------------------------------------------------
        # SAVE PRIORITY RANKS
        # --------------------------------------------------

        for item in ranked_problems:

            (
                supabase
                .table("problems")
                .update({
                    "priority_rank": item["rank"]
                })
                .eq(
                    "id",
                    item["id"]
                )
                .execute()

            )


        # --------------------------------------------------
        # FIND NEW PROBLEM RANK
        # --------------------------------------------------

        new_problem_rank = next(

            item["rank"]

            for item in ranked_problems

            if item["id"] ==
            saved_problem["id"]

        )


        # --------------------------------------------------
        # RESPONSE
        # --------------------------------------------------

        return {

            "success": True,

            "problem_id":
                saved_problem["id"],

            "priority_rank":
                new_problem_rank,

            "analysis":
                result

        }


    finally:

        # --------------------------------------------------
        # DELETE TEMPORARY IMAGE
        # --------------------------------------------------

        if os.path.exists(
            image_path
        ):

            os.remove(
                image_path
            )


# --------------------------------------------------
# RANK ALL PROBLEMS
# --------------------------------------------------

@app.post("/rank")
def rank_all_problems():

    response = (

        supabase
        .table("problems")
        .select("*")
        .eq(
            "status",
            "submitted"
        )
        .execute()

    )


    problems = response.data


    ranked_problems = rank_problems(
        problems
    )


    # Save ranks

    for item in ranked_problems:

        (
            supabase
            .table("problems")
            .update({
                "priority_rank":
                    item["rank"]
            })
            .eq(
                "id",
                item["id"]
            )
            .execute()

        )


    return {

        "success": True,

        "count":
            len(ranked_problems),

        "ranked_problems": [

            {

                "rank":
                    item["rank"],

                "id":
                    item["id"],

                "score":
                    item["score"],

                "title":
                    item["problem"]["title"]

            }

            for item in ranked_problems

        ]

    }


# --------------------------------------------------
# GOVERNMENT - GET SUBMITTED PROBLEMS
# --------------------------------------------------

@app.get("/problems")
def get_problems():

    response = (

        supabase
        .table("problems")
        .select("*")
        .eq(
            "status",
            "submitted"
        )
        .order(
            "priority_rank",
            desc=False
        )
        .execute()

    )


    return {

        "success": True,

        "problems":
            response.data

    }


# --------------------------------------------------
# CITIZEN - GET OWN PROBLEMS
# --------------------------------------------------

@app.get("/citizen/problems")
def get_citizen_problems(

    authorization: str | None = Header(
        default=None
    )

):

    # Identify logged-in citizen

    user = get_current_user(
        authorization
    )


    response = (

        supabase
        .table("problems")
        .select("*")
        .eq(
            "user_id",
            str(user.id)
        )
        .order(
            "created_at",
            desc=True
        )
        .execute()

    )


    return {

        "success": True,

        "problems":
            response.data

    }


# --------------------------------------------------
# CITIZEN - GET OWN NOTIFICATIONS
# --------------------------------------------------

@app.get("/citizen/notifications")
def get_citizen_notifications(

    authorization: str | None = Header(
        default=None
    )

):

    # Identify logged-in citizen

    user = get_current_user(
        authorization
    )


    response = (

        supabase
        .table("notifications")
        .select("*")
        .eq(
            "user_id",
            str(user.id)
        )
        .order(
            "created_at",
            desc=True
        )
        .execute()

    )


    return {

        "success": True,

        "notifications":
            response.data

    }


# --------------------------------------------------
# MARK ONE NOTIFICATION AS READ
# --------------------------------------------------

@app.patch(
    "/notifications/{notification_id}/read"
)
def mark_notification_read(

    notification_id: str,

    authorization: str | None = Header(
        default=None
    )

):

    user = get_current_user(
        authorization
    )


    response = (

        supabase
        .table("notifications")
        .update({
            "is_read": True
        })
        .eq(
            "id",
            notification_id
        )
        .eq(
            "user_id",
            str(user.id)
        )
        .execute()

    )


    if not response.data:

        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )


    return {

        "success": True,

        "notification":
            response.data[0]

    }


# --------------------------------------------------
# MARK ALL NOTIFICATIONS AS READ
# --------------------------------------------------

@app.patch(
    "/citizen/notifications/read-all"
)
def mark_all_notifications_read(

    authorization: str | None = Header(
        default=None
    )

):

    user = get_current_user(
        authorization
    )


    response = (

        supabase
        .table("notifications")
        .update({
            "is_read": True
        })
        .eq(
            "user_id",
            str(user.id)
        )
        .eq(
            "is_read",
            False
        )
        .execute()

    )


    return {

        "success": True,

        "notifications":
            response.data

    }


# --------------------------------------------------
# GET INDIVIDUAL PROBLEM
# --------------------------------------------------

@app.get(
    "/problems/{problem_id}"
)
def get_problem(
    problem_id: str
):

    response = (

        supabase
        .table("problems")
        .select("*")
        .eq(
            "id",
            problem_id
        )
        .single()
        .execute()

    )


    return {

        "success": True,

        "problem":
            response.data

    }


# --------------------------------------------------
# GOVERNMENT - UPDATE PROBLEM STATUS
# --------------------------------------------------

@app.patch(
    "/problems/{problem_id}/status"
)
def update_problem_status(

    problem_id: str,

    status_data: dict

):

    new_status = status_data.get(
        "status"
    )


    if new_status not in [
        "approved",
        "rejected"
    ]:

        return {

            "success": False,

            "message":
                "Invalid status"

        }


    response = (

        supabase
        .table("problems")
        .update({
            "status":
                new_status
        })
        .eq(
            "id",
            problem_id
        )
        .execute()

    )


    return {

        "success": True,

        "problem":
            response.data[0]

    }


# --------------------------------------------------
# UNIVERSITY - GET APPROVED PROBLEMS
# --------------------------------------------------

@app.get("/university/problems")
def get_university_problems():

    response = (

        supabase
        .table("problems")
        .select("*")
        .eq(
            "status",
            "approved"
        )
        .order(
            "priority_rank",
            desc=False
        )
        .execute()

    )


    return {

        "success": True,

        "problems":
            response.data

    }