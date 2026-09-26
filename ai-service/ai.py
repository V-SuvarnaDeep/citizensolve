import os
import base64
import json

from dotenv import load_dotenv
from google import genai


load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY was not found in .env")

client = genai.Client(api_key=api_key)


def analyze_problem(
    title,
    description,
    category,
    location,
    impact,
    urgency,
    image_path
):
    with open(image_path, "rb") as image_file:
        image_data = base64.b64encode(image_file.read()).decode("utf-8")

    prompt = f"""
You are Civiora AI, an AI system that analyzes citizen-reported
civic problems.

Analyze BOTH:
1. The information provided by the citizen.
2. The uploaded photograph.

Do not rely only on the citizen's claims.
Use visible evidence from the photograph where appropriate.

CITIZEN REPORT

Title:
{title}

Description:
{description}

Category:
{category}

Location:
{location}

Impact:
{impact}

Urgency:
{urgency}

Analyze the problem and return ONLY valid JSON.

Use exactly this structure:

{{
    "category": "",
    "problemType": "",
    "severity": "",
    "urgency": "",
    "visualFindings": [],
    "visualSeverity": "",
    "affectedGroups": [],
    "affectedPopulation": 0,
    "safetyRisk": "",
    "geographicImpact": "",
    "timeSensitivity": "",
    "requiredSkills": [],
    "keywords": [],
    "summary": ""
}}

Rules:

1. severity must be one of:
   Low, Medium, High, Critical

2. urgency must be one of:
   Low, Medium, High, Critical

3. visualSeverity must be one of:
   Low, Medium, High, Critical

4. safetyRisk must be one of:
   Low, Medium, High, Critical

5. affectedPopulation must be an estimated number of people
   directly or significantly affected by the problem.

   Use the citizen's information and reasonable contextual
   evidence. If an exact number is unavailable, provide a
   reasonable estimate rather than inventing false precision.

6. geographicImpact must be one of:
   Local, Regional, Citywide

7. timeSensitivity must be one of:
   Low, Medium, High, Immediate

8. Consider the following factors carefully:
   - visible damage
   - safety hazards
   - severity
   - urgency
   - number of people affected
   - geographic impact
   - how quickly the problem needs attention

9. visualFindings must contain only things that can reasonably
   be observed in the photograph.

10. Do not invent details that cannot be supported by the
    citizen's information or photograph.

11. If the photograph does not provide enough evidence for
    something, do not claim that it is visible.

12. Keep the summary short and understandable.

13. Do NOT calculate a final priority score.

14. Do NOT assign a priority rank.

15. The final priority rank will be calculated later by Civiora
    by comparing this problem with other citizen problems.

16. The AI is providing an assessment and recommendation.
    It does NOT make the government's final approval decision.
"""

    interaction = client.interactions.create(
        model="gemini-3.6-flash",
        input=[
            {
                "type": "text",
                "text": prompt
            },
            {
                "type": "image",
                "mime_type": "image/jpeg",
                "data": image_data
            }
        ],
        response_format={
            "type": "text",
            "mime_type": "application/json",
            "schema": {
                "type": "object",
                "properties": {
                    "category": {
                        "type": "string"
                    },
                    "problemType": {
                        "type": "string"
                    },
                    "severity": {
                        "type": "string",
                        "enum": [
                            "Low",
                            "Medium",
                            "High",
                            "Critical"
                        ]
                    },
                    "urgency": {
                        "type": "string",
                        "enum": [
                            "Low",
                            "Medium",
                            "High",
                            "Critical"
                        ]
                    },
                    "visualFindings": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "visualSeverity": {
                        "type": "string",
                        "enum": [
                            "Low",
                            "Medium",
                            "High",
                            "Critical"
                        ]
                    },
                    "affectedGroups": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "affectedPopulation": {
                        "type": "integer",
                        "minimum": 0
                    },
                    "safetyRisk": {
                        "type": "string",
                        "enum": [
                            "Low",
                            "Medium",
                            "High",
                            "Critical"
                        ]
                    },
                    "geographicImpact": {
                        "type": "string",
                        "enum": [
                            "Local",
                            "Regional",
                            "Citywide"
                        ]
                    },
                    "timeSensitivity": {
                        "type": "string",
                        "enum": [
                            "Low",
                            "Medium",
                            "High",
                            "Immediate"
                        ]
                    },
                    "requiredSkills": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "keywords": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "summary": {
                        "type": "string"
                    }
                },
                "required": [
                    "category",
                    "problemType",
                    "severity",
                    "urgency",
                    "visualFindings",
                    "visualSeverity",
                    "affectedGroups",
                    "affectedPopulation",
                    "safetyRisk",
                    "geographicImpact",
                    "timeSensitivity",
                    "requiredSkills",
                    "keywords",
                    "summary"
                ]
            }
        }
    )

    return json.loads(interaction.output_text)
def match_company_with_gemini(
    solution,
    problem,
    companies
):
    company_data = []

    for company in companies:
        company_data.append({
            "id": company.get("id"),
            "company_name": company.get("company_name"),
            "location": company.get("location"),
            "industries": company.get("industries") or [],
            "expertise": company.get("expertise") or [],
            "technologies": company.get("technologies") or [],
            "capabilities": company.get("capabilities") or [],
            "description": company.get("description") or ""
        })

    prompt = f"""
You are Civiora AI, an AI system that matches approved
civic solutions with the most suitable company.

Your task is to select EXACTLY ONE company that is the
best fit to implement the approved solution.

CIVIC PROBLEM

Title:
{problem.get("title", "")}

Description:
{problem.get("description", "")}

Category:
{problem.get("category", "")}

Location:
{problem.get("location", "")}

AI Analysis:
{json.dumps(problem.get("ai_analysis") or {}, indent=2)}


APPROVED UNIVERSITY SOLUTION

Title:
{solution.get("title", "")}

Description:
{solution.get("description", "")}

Approach:
{solution.get("approach", "")}

Technologies:
{solution.get("technologies", "")}

Expected Impact:
{solution.get("expected_impact", "")}


AVAILABLE COMPANIES

{json.dumps(company_data, indent=2)}


Return ONLY valid JSON.

Use exactly this structure:

{{
    "company_id": "",
    "match_score": 0,
    "match_reason": ""
}}

Rules:

1. Select EXACTLY ONE company.

2. company_id must be the id of one of the companies
   provided above.

3. match_score must be a number from 0 to 100.

4. Consider:
   - company expertise
   - company industries
   - company technologies
   - company capabilities
   - solution technologies
   - solution approach
   - type of civic problem
   - expected impact
   - location when relevant

5. Select the company that is most capable of actually
   implementing the solution.

6. Do not select a company based only on its name.

7. Give a short practical reason explaining why the company
   matches the solution.

8. Do not invent companies or company information.

9. Do not return multiple companies.

10. This is a recommendation for government decision support.
    The government remains the final authority.
"""

    interaction = client.interactions.create(
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
                    "company_id": {
                        "type": "string"
                    },
                    "match_score": {
                        "type": "number",
                        "minimum": 0,
                        "maximum": 100
                    },
                    "match_reason": {
                        "type": "string"
                    }
                },
                "required": [
                    "company_id",
                    "match_score",
                    "match_reason"
                ]
            }
        }
    )

    return json.loads(interaction.output_text)