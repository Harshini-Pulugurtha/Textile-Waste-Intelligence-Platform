def calculate_textile_score(result):
    """
    Calculate overall textile quality score.
    Returns a score out of 100.
    """

    score = 100

    # Condition
    if result.get("condition") == "Damaged":
        score -= 35
    elif result.get("condition") == "Slightly Damaged":
        score -= 15

    # Damage
    if result.get("damage") == "Damaged":
        score -= 25
    elif result.get("damage") == "Slightly Damaged":
        score -= 10

    # Contamination
    contamination = result.get("contamination")

    if contamination == "Highly Contaminated":
        score -= 25
    elif contamination == "Dusty":
        score -= 15
    elif contamination == "Slightly Dirty":
        score -= 8

    score = max(0, min(100, score))

    if score >= 85:
        grade = "A"

    elif score >= 70:
        grade = "B"

    elif score >= 55:
        grade = "C"

    elif score >= 40:
        grade = "D"

    else:
        grade = "F"

    return {
        "textile_score": score,
        "grade": grade
    }