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