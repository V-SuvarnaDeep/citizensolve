import os
import tempfile
import json
from datetime import datetime, timedelta
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
from google import genai

from ai import (
    analyze_problem,
    match_company_with_gemini
)
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

gemini_api_key = os.getenv("GEMINI_API_KEY")

if not gemini_api_key:
    raise ValueError("GEMINI_API_KEY was not found in .env")

gemini_client = genai.Client(
    api_key=gemini_api_key
)


# --------------------------------------------------
# FASTAPI APP
# --------------------------------------------------

app = FastAPI(
    title="Civiora AI Service"
)
@app.middleware("http")
async def remove_api_prefix(request, call_next):
    if request.scope["path"].startswith("/api"):
        request.scope["path"] = request.scope["path"][4:]

        if request.scope["path"] == "":
            request.scope["path"] = "/"

    response = await call_next(request)

    return response

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

        (

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
# MATCH ONE UNIVERSITY TO PROBLEM
# --------------------------------------------------

def match_university(problem):

    analysis = problem.get("ai_analysis") or {}

    required_skills = analysis.get("requiredSkills", [])
    keywords = analysis.get("keywords", [])

    if isinstance(required_skills, str):
        required_skills = [required_skills]

    if isinstance(keywords, str):
        keywords = [keywords]

    problem_words = []

    problem_words.extend(required_skills)
    problem_words.extend(keywords)
    problem_words.append(problem.get("category", ""))
    problem_words.append(problem.get("title", ""))
    problem_words.append(problem.get("description", ""))

    problem_text = " ".join(
        str(word).lower()
        for word in problem_words
    )

    universities_response = (
        supabase
        .table("universities")
        .select("*")
        .execute()
    )

    universities = universities_response.data

    if not universities:
        return None

    matches = []

    for university in universities:

        university_words = []

        university_words.extend(
            university.get("departments") or []
        )

        university_words.extend(
            university.get("expertise") or []
        )

        university_words.extend(
            university.get("technologies") or []
        )

        university_words.extend(
            university.get("capabilities") or []
        )

        score = 0
        matched_items = []

        for word in university_words:

            word_text = str(word).lower().strip()

            if word_text and word_text in problem_text:
                score += 1
                matched_items.append(str(word))

        matches.append({
            "university": university,
            "score": score,
            "matched_items": matched_items
        })

    matches.sort(
        key=lambda item: item["score"],
        reverse=True
    )

    return matches[0]


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

    if not response.data:

        raise HTTPException(
            status_code=404,
            detail="Problem not found"
        )


    updated_problem = response.data[0]

    # --------------------------------------------------
    # SELECT ONE UNIVERSITY AFTER GOVERNMENT APPROVAL
    # --------------------------------------------------

    if new_status == "approved":

        match = match_university(
            updated_problem
        )

        if match:

            university = match["university"]

            university_id = university["id"]
            profile_id = university["profile_id"]

            match_score = match["score"]

            matched_items = match["matched_items"]

            if matched_items:
                match_reason = (
                    "Matched based on: "
                    + ", ".join(matched_items)
                )
            else:
                match_reason = (
                    "Selected as the best available university "
                    "for this civic problem."
                )

            # --------------------------------------------------
            # SAVE ONE UNIVERSITY MATCH
            # --------------------------------------------------

            existing_match = (

                supabase
                .table("problem_university_matches")
                .select("id")
                .eq(
                    "problem_id",
                    problem_id
                )
                .execute()

            )

            if not existing_match.data:

                (
                    supabase
                    .table("problem_university_matches")
                    .insert({

                        "problem_id":
                            problem_id,

                        "university_id":
                            university_id,

                        "match_score":
                            match_score,

                        "match_rank":
                            1,

                        "match_reason":
                            match_reason,

                        "status":
                            "allocated"

                    })
                    .execute()
                )

            # --------------------------------------------------
            # NOTIFY SELECTED UNIVERSITY
            # --------------------------------------------------

            create_notification(
                profile_id,

                "New Civic Problem Assigned",

                f'The problem "{updated_problem["title"]}" has been assigned to {university.get("university_name", "your university")} for solution development.',

                "assignment"

            )

    return {

        "success": True,

        "problem":
            updated_problem

    }



# --------------------------------------------------
# UNIVERSITY - GET ALLOCATED PROBLEMS
# --------------------------------------------------

@app.get("/university/problems")
def get_university_problems(
    authorization: str | None = Header(
        default=None
    )
):

    # Get logged-in university user
    user = get_current_user(
        authorization
    )

    # Find university record
    university_response = (
        supabase
        .table("universities")
        .select("*")
        .eq(
            "profile_id",
            str(user.id)
        )
        .single()
        .execute()
    )

    university = university_response.data

    if not university:
        return {
            "success": True,
            "problems": []
        }

    # Find problems allocated to this university
    matches_response = (
        supabase
        .table("problem_university_matches")
        .select("problem_id")
        .eq(
            "university_id",
            university["id"]
        )
        .eq(
            "status",
            "allocated"
        )
        .execute()
    )

    matches = matches_response.data

    if not matches:
        return {
            "success": True,
            "problems": []
        }

    problem_ids = [
        match["problem_id"]
        for match in matches
    ]

    # Get only allocated problems
    problems_response = (
        supabase
        .table("problems")
        .select("*")
        .in_(
            "id",
            problem_ids
        )
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
            problems_response.data
    }
    # --------------------------------------------------
# GOVERNMENT - APPROVE SOLUTION AND MATCH COMPANY
# --------------------------------------------------

@app.patch("/solutions/{solution_id}/status")
def update_solution_status(
    solution_id: str,
    status_data: dict
):
    new_status = status_data.get("status")

    if new_status not in [
        "approved",
        "rejected"
    ]:
        return {
            "success": False,
            "message": "Invalid solution status"
        }

    # --------------------------------------------------
    # GET SOLUTION
    # --------------------------------------------------

    solution_response = (
        supabase
        .table("solutions")
        .select("*")
        .eq("id", solution_id)
        .single()
        .execute()
    )

    solution = solution_response.data

    if not solution:
        raise HTTPException(
            status_code=404,
            detail="Solution not found"
        )

    # --------------------------------------------------
    # UPDATE SOLUTION STATUS
    # --------------------------------------------------

    updated_response = (
        supabase
        .table("solutions")
        .update({
            "status": new_status
        })
        .eq("id", solution_id)
        .execute()
    )

    if not updated_response.data:
        raise HTTPException(
            status_code=404,
            detail="Solution could not be updated"
        )

    updated_solution = updated_response.data[0]

    # --------------------------------------------------
    # MATCH COMPANY AFTER GOVERNMENT APPROVAL
    # --------------------------------------------------

    if new_status == "approved":

        # Get original civic problem

        problem_response = (
            supabase
            .table("problems")
            .select("*")
            .eq(
                "id",
                solution["problem_id"]
            )
            .single()
            .execute()
        )

        problem = problem_response.data

        if not problem:
            raise HTTPException(
                status_code=404,
                detail="Related problem not found"
            )

        # Get all companies

        companies_response = (
            supabase
            .table("companies")
            .select("*")
            .execute()
        )

        companies = companies_response.data

        if companies:

            # --------------------------------------------------
            # GEMINI COMPANY MATCHING
            # --------------------------------------------------

            company_match = match_company_with_gemini(
                updated_solution,
                problem,
                companies
            )

            company_id = company_match.get(
                "company_id"
            )

            match_score = company_match.get(
                "match_score",
                0
            )

            match_reason = company_match.get(
                "match_reason",
                ""
            )

            # --------------------------------------------------
            # VERIFY COMPANY EXISTS
            # --------------------------------------------------

            selected_company = None

            for company in companies:

                if str(company["id"]) == str(company_id):
                    selected_company = company
                    break

            if selected_company:

                # --------------------------------------------------
                # CHECK EXISTING OPPORTUNITY
                # --------------------------------------------------

                existing_opportunity = (
                    supabase
                    .table("company_opportunities")
                    .select("id")
                    .eq(
                        "company_id",
                        selected_company["id"]
                    )
                    .eq(
                        "solution_id",
                        solution_id
                    )
                    .execute()
                )

                if not existing_opportunity.data:

                    # --------------------------------------------------
                    # SAVE COMPANY OPPORTUNITY
                    # --------------------------------------------------

                    (
                        supabase
                        .table("company_opportunities")
                        .insert({
                            "company_id":
                                selected_company["id"],

                            "solution_id":
                                solution_id,

                            "problem_id":
                                solution["problem_id"],

                            "match_score":
                                match_score,

                            "match_reason":
                                match_reason,

                            "status":
                                "pending"
                        })
                        .execute()
                    )

                # --------------------------------------------------
                # NOTIFY COMPANY
                # --------------------------------------------------

                create_notification(
                    selected_company["profile_id"],

                    "New Solution Opportunity",

                    f'The approved solution "{updated_solution["title"]}" has been matched to {selected_company.get("company_name", "your company")} for implementation review.',

                    "company_opportunity"
                )

    return {
        "success": True,
        "solution": updated_solution
    }


# --------------------------------------------------
# AI MEETING SCHEDULER
# --------------------------------------------------

def schedule_meeting_with_gemini(
    solution,
    problem,
    company
):
    # Create a few valid future meeting slots.
    # Civiora gives Gemini the available slots instead of
    # allowing it to invent a date or time.

    slots = []

    current_date = datetime.now().date()

    for day_offset in range(1, 6):
        meeting_date = current_date + timedelta(days=day_offset)

        # Skip Sunday
        if meeting_date.weekday() == 6:
            continue

        for hour in [10, 14, 16]:
            slots.append({
                "date": meeting_date.isoformat(),
                "time": f"{hour:02d}:00:00"
            })

    slot_text = json.dumps(
        slots,
        indent=2
    )

    prompt = f"""
You are Civiora AI meeting scheduler.

A company has accepted an approved civic implementation
opportunity.

Select ONE suitable meeting slot from the available slots.

The meeting is for:
- technical discussion
- implementation planning
- project timeline
- estimated cost and budget discussion
- funding/commercial discussion
- responsibilities
- next steps

Do not invent a date or time.
Choose only one slot from AVAILABLE SLOTS.

CIVIC PROBLEM:
Title: {problem.get("title", "")}
Description: {problem.get("description", "")}
Category: {problem.get("category", "")}
Location: {problem.get("location", "")}

APPROVED SOLUTION:
Title: {solution.get("title", "")}
Description: {solution.get("description", "")}
Approach: {solution.get("approach", "")}
Technologies: {solution.get("technologies", "")}
Expected Impact: {solution.get("expected_impact", "")}

COMPANY:
Name: {company.get("company_name", "")}
Location: {company.get("location", "")}
Expertise: {json.dumps(company.get("expertise") or [])}
Capabilities: {json.dumps(company.get("capabilities") or [])}

AVAILABLE SLOTS:
{slot_text}

Return ONLY valid JSON:

{{
    "slot_index": 0,
    "reason": ""
}}

Rules:
1. slot_index must be the index of exactly one available slot.
2. Do not invent a slot.
3. Prefer a slot that gives reasonable preparation time.
4. The reason must be short.
"""

    try:
        interaction = gemini_client.interactions.create(
            model="gemini-3.6-flash",
            input=[
                {
                    "type": "text",
                    "text": prompt
                }
            ],
            response_format={
                "type": "text",
                "mime_type": "application/json",
                "schema": {
                    "type": "object",
                    "properties": {
                        "slot_index": {
                            "type": "integer",
                            "minimum": 0
                        },
                        "reason": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "slot_index",
                        "reason"
                    ]
                }
            }
        )

        result = json.loads(
            interaction.output_text
        )

        slot_index = int(
            result.get("slot_index", 0)
        )

        if slot_index < 0 or slot_index >= len(slots):
            slot_index = 0

        return slots[slot_index], result.get(
            "reason",
            "Selected by Civiora AI based on project requirements."
        )

    except Exception as error:
        print(
            "AI meeting scheduling failed:",
            error
        )

        # Safe fallback so the prototype still works if
        # Gemini has a temporary failure.
        return slots[0], (
            "Civiora selected the earliest available "
            "future working-day slot."
        )


# --------------------------------------------------
# COMPANY - ACCEPT OPPORTUNITY AND CREATE MEETING
# --------------------------------------------------

@app.patch(
    "/company-opportunities/{opportunity_id}/status"
)
def update_company_opportunity_status(
    opportunity_id: str,
    status_data: dict
):
    new_status = status_data.get("status")

    if new_status not in [
        "accepted",
        "rejected"
    ]:
        raise HTTPException(
            status_code=400,
            detail="Invalid company opportunity status"
        )

    # Get opportunity
    opportunity_response = (
        supabase
        .table("company_opportunities")
        .select("*")
        .eq("id", opportunity_id)
        .single()
        .execute()
    )

    opportunity = opportunity_response.data

    if not opportunity:
        raise HTTPException(
            status_code=404,
            detail="Company opportunity not found"
        )

    # Update company response
    response_text = (
        "Company accepted the opportunity."
        if new_status == "accepted"
        else "Company rejected the opportunity."
    )

    updated_response = (
        supabase
        .table("company_opportunities")
        .update({
            "status": new_status,
            "company_response": response_text,
            "responded_at": datetime.utcnow().isoformat()
        })
        .eq("id", opportunity_id)
        .execute()
    )

    if not updated_response.data:
        raise HTTPException(
            status_code=500,
            detail="Company opportunity could not be updated"
        )

    updated_opportunity = updated_response.data[0]

    # If rejected, there is nothing else to schedule.
    if new_status == "rejected":
        return {
            "success": True,
            "opportunity": updated_opportunity
        }

    # --------------------------------------------------
    # CHECK IF A MEETING ALREADY EXISTS
    # --------------------------------------------------

    existing_meeting_response = (
        supabase
        .table("meetings")
        .select("*")
        .eq(
            "opportunity_id",
            opportunity_id
        )
        .execute()
    )

    if existing_meeting_response.data:
        return {
            "success": True,
            "opportunity": updated_opportunity,
            "meeting": existing_meeting_response.data[0]
        }

    # --------------------------------------------------
    # GET SOLUTION
    # --------------------------------------------------

    solution_response = (
        supabase
        .table("solutions")
        .select("*")
        .eq(
            "id",
            opportunity["solution_id"]
        )
        .single()
        .execute()
    )

    solution = solution_response.data

    if not solution:
        raise HTTPException(
            status_code=404,
            detail="Solution not found"
        )

    # --------------------------------------------------
    # GET PROBLEM
    # --------------------------------------------------

    problem_response = (
        supabase
        .table("problems")
        .select("*")
        .eq(
            "id",
            opportunity["problem_id"]
        )
        .single()
        .execute()
    )

    problem = problem_response.data

    if not problem:
        raise HTTPException(
            status_code=404,
            detail="Problem not found"
        )

    # --------------------------------------------------
    # GET COMPANY
    # --------------------------------------------------

    company_response = (
        supabase
        .table("companies")
        .select("*")
        .eq(
            "id",
            opportunity["company_id"]
        )
        .single()
        .execute()
    )

    company = company_response.data

    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company not found"
        )

    # --------------------------------------------------
    # GET GOVERNMENT USER
    # --------------------------------------------------

    government_response = (
        supabase
        .table("profiles")
        .select("id, role")
        .execute()
    )

    government_profiles = [
        profile
        for profile in (government_response.data or [])
        if str(profile.get("role", "")).lower() == "government"
    ]

    if not government_profiles:
        raise HTTPException(
            status_code=404,
            detail="Government profile not found"
        )

    government_id = government_profiles[0]["id"]

    # --------------------------------------------------
    # AI SELECTS MEETING SLOT
    # --------------------------------------------------

    selected_slot, ai_reason = (
        schedule_meeting_with_gemini(
            solution,
            problem,
            company
        )
    )

    # --------------------------------------------------
    # CREATE MEETING
    # --------------------------------------------------

    meeting_title = (
        f'{solution["title"]} - '
        "Implementation Discussion"
    )

    meeting_purpose = (
        "Technical implementation, project timeline, "
        "estimated cost, budget, funding and "
        "responsibility discussion."
    )

    meeting_agenda = [
        "Review the civic problem",
        "Review the university solution",
        "Discuss technical requirements",
        "Discuss implementation timeline",
        "Discuss estimated project cost",
        "Discuss funding and commercial terms",
        "Finalize responsibilities",
        "Agree on next steps"
    ]

    meeting_response = (
        supabase
        .table("meetings")
        .insert({
            "opportunity_id":
                opportunity_id,

            "solution_id":
                opportunity["solution_id"],

            "problem_id":
                opportunity["problem_id"],

            "government_id":
                government_id,

            "company_id":
                opportunity["company_id"],

            "meeting_title":
                meeting_title,

            "meeting_date":
                selected_slot["date"],

            "meeting_time":
                selected_slot["time"],

            "purpose":
                meeting_purpose,

            "agenda":
                meeting_agenda,

            "status":
                "scheduled",

            "ai_reason":
                ai_reason
        })
        .execute()
    )

    if not meeting_response.data:
        raise HTTPException(
            status_code=500,
            detail="Meeting could not be created"
        )

    meeting = meeting_response.data[0]

    # --------------------------------------------------
    # NOTIFY GOVERNMENT
    # --------------------------------------------------

    create_notification(
        government_id,

        "Civiora Meeting Scheduled",

        f'An implementation meeting for "{solution["title"]}" has been scheduled with {company.get("company_name", "the selected company")} on {selected_slot["date"]} at {selected_slot["time"][:5]}. The meeting will cover technical requirements, implementation, budget and funding discussions.',

        "meeting"
    )

    # --------------------------------------------------
    # NOTIFY COMPANY
    # --------------------------------------------------

    create_notification(
        company["profile_id"],

        "Civiora Meeting Scheduled",

        f'Your company has accepted the opportunity for "{solution["title"]}". Civiora AI has scheduled an implementation meeting on {selected_slot["date"]} at {selected_slot["time"][:5]}. The meeting will cover technical requirements, implementation, budget and funding discussions.',

        "meeting"
    )

    return {
        "success": True,
        "opportunity": updated_opportunity,
        "meeting": meeting
    }

