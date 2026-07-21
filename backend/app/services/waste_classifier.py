# def classify_waste(condition, texture):

#     if condition in ["Excellent", "Good"]:
#         return {
#             "waste_category": "Reusable",
#             "recyclability": "High",
#             "recommendation": "Suitable for donation, resale, or reuse."
#         }

#     elif condition == "Fair":

#         if texture in ["Smooth", "Medium Texture"]:
#             return {
#                 "waste_category": "Recyclable",
#                 "recyclability": "Medium",
#                 "recommendation": "Can be recycled into textile fibers."
#             }

#         return {
#             "waste_category": "Upcyclable",
#             "recyclability": "Medium",
#             "recommendation": "Suitable for creative reuse or repurposing."
#         }

#     else:
#         return {
#             "waste_category": "Disposal",
#             "recyclability": "Low",
#             "recommendation": "Inspect manually before disposal."
#         }

def classify_waste(condition, damage, contamination, texture):

    # Good quality fabric
    if (
        condition in ["Excellent", "Good"] and
        damage == "Normal" and
        contamination == "Clean"
    ):
        return {
            "waste_category": "Reusable",
            "recyclability": "High",
            "recommendation": "Suitable for donation, resale, or reuse."
        }

    # Minor issues
    elif (
        condition in ["Fair", "Needs Inspection"] or
        contamination in ["Dusty", "Slightly Dirty"]
    ):
        return {
            "waste_category": "Recyclable",
            "recyclability": "Medium",
            "recommendation": "Can be recycled after inspection and cleaning."
        }

    # Serious damage
    elif damage == "Defect":
        return {
            "waste_category": "Upcyclable",
            "recyclability": "Medium",
            "recommendation": "Suitable for repair or creative reuse."
        }

    # Severe contamination
    else:
        return {
            "waste_category": "Disposal",
            "recyclability": "Low",
            "recommendation": "Dispose responsibly following textile waste guidelines."
        }