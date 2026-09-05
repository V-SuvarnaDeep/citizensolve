from ai import analyze_problem


result = analyze_problem(
    title="Bridge collapse causing major public access problem",

    description=(
        "A bridge section has collapsed over a river, leaving a "
        "large gap in the road. People and vehicles can no longer "
        "cross normally."
    ),

    category="Infrastructure",

    location="India",

    impact=(
        "Local residents, commuters and vehicles are affected. "
        "The damaged bridge may create a serious safety risk."
    ),

    urgency="High",

    image_path="test_image.jpg"
)


print("\nCIVIORA AI ANALYSIS")
print("===================")

for key, value in result.items():
    print(f"{key}: {value}")