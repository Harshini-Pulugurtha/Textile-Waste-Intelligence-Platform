# def generate_recommendation(result):

#     condition = result["condition"]
#     waste = result["waste_category"]

#     if condition == "Excellent":
#         return "Suitable for Donation"

#     if condition == "Good":
#         return "Reuse Recommended"

#     if condition == "Slightly Damaged":
#         return "Repair Before Reuse"

#     if waste == "Recyclable":
#         return "Send to Textile Recycling Center"

#     return "Dispose Responsibly"

def generate_recommendation(result):

    condition = result["condition"]
    damage = result["damage"]
    contamination = result["contamination"]
    waste = result["waste_category"]

    # Best case
    if (
        condition in ["Excellent", "Good"] and
        damage == "Normal" and
        contamination == "Clean"
    ):
        return "Suitable for donation, resale, or direct reuse."

    # Needs inspection but repairable
    if (
        condition in ["Standard", "Needs Inspection"] and
        damage == "Normal"
    ):
        return "Inspect and clean before reuse."

    # Defective fabric
    if damage == "Defect":
        return "Repair or upcycle before reuse."

    # Recycling
    if waste == "Recyclable":
        return "Send to an authorized textile recycling center."

    if waste == "Upcyclable":
        return "Repurpose into new textile products."

    # Disposal
    return "Dispose responsibly following textile waste management guidelines."