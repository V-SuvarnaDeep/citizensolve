SEVERITY_SCORES = {
    "low": 1,
    "medium": 2,
    "high": 3,
    "critical": 4,
}

SAFETY_SCORES = {
    "low": 1,
    "medium": 2,
    "high": 3,
    "critical": 4,
}

URGENCY_SCORES = {
    "low": 1,
    "medium": 2,
    "high": 3,
    "critical": 4,
}

TIME_SENSITIVITY_SCORES = {
    "low": 1,
    "medium": 2,
    "high": 3,
    "immediate": 4,
}

GEOGRAPHIC_IMPACT_SCORES = {
    "local": 1,
    "district": 2,
    "regional": 3,
    "national": 4,
}


def normalize(value):
    if value is None:
        return ""

    return str(value).strip().lower()


def population_score(population):
    try:
        population = int(population)

        if population >= 10000:
            return 4
        elif population >= 5000:
            return 3
        elif population >= 1000:
            return 2
        else:
            return 1

    except (ValueError, TypeError):
        return 1


def calculate_priority_score(problem):
    analysis = problem.get("ai_analysis") or {}

    severity = normalize(analysis.get("severity"))
    safety_risk = normalize(analysis.get("safetyRisk"))
    urgency = normalize(analysis.get("urgency"))
    time_sensitivity = normalize(analysis.get("timeSensitivity"))
    geographic_impact = normalize(analysis.get("geographicImpact"))
    visual_severity = normalize(analysis.get("visualSeverity"))

    affected_population = analysis.get("affectedPopulation", 0)

    severity_score = SEVERITY_SCORES.get(severity, 1)
    safety_score = SAFETY_SCORES.get(safety_risk, 1)
    urgency_score = URGENCY_SCORES.get(urgency, 1)
    time_score = TIME_SENSITIVITY_SCORES.get(time_sensitivity, 1)
    geographic_score = GEOGRAPHIC_IMPACT_SCORES.get(
        geographic_impact,
        1
    )
    visual_score = SEVERITY_SCORES.get(
        visual_severity,
        1
    )
    population_score_value = population_score(
        affected_population
    )

    score = (
        severity_score * 20
        + safety_score * 20
        + urgency_score * 15
        + population_score_value * 15
        + time_score * 10
        + visual_score * 10
        + geographic_score * 10
    )

    return score


def rank_problems(problems):
    ranked_problems = []

    for problem in problems:
        score = calculate_priority_score(problem)

        ranked_problems.append({
            "id": problem["id"],
            "score": score,
            "problem": problem,
        })

    ranked_problems.sort(
        key=lambda item: item["score"],
        reverse=True
    )

    for index, item in enumerate(ranked_problems, start=1):
        item["rank"] = index

    return ranked_problems