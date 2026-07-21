import os
import shutil

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.classifier import predict_damage
from app.services.color_analysis import analyze_color
from app.services.texture_analysis import analyze_texture
from app.services.condition_analysis import analyze_condition
from app.services.waste_classifier import classify_waste
from app.services.pattern_analysis import analyze_pattern
from app.models import TextileAnalysis
#from app.services.damage_analysis import analyze_damage
from app.services.contamination_analysis import analyze_contamination
from app.services.recommendation_engine import generate_recommendation
from app.services.material_analysis import classify_material
from app.database import SessionLocal

router = APIRouter()

# ==========================================
# Upload Folder
# ==========================================

UPLOAD_FOLDER = os.path.join(
    os.path.dirname(__file__),
    "..",
    "uploads"
)

UPLOAD_FOLDER = os.path.abspath(UPLOAD_FOLDER)

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

# ==========================================
# Predict Material
# ==========================================

@router.post("/predict")
async def classify_image(image: UploadFile = File(...)):

    db = SessionLocal()

    try:
        # Accept only image files
        if not image.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400,
                detail="Please upload an image."
            )

        # Save uploaded image
        file_path = os.path.join(UPLOAD_FOLDER, image.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        # Predict
        result = {}

        result["color"] = analyze_color(file_path)
        result["texture"] = analyze_texture(file_path)
        result["pattern"] = analyze_pattern(file_path)
        result["condition"] = analyze_condition(file_path)
        damage_result = predict_damage(file_path)

        result["damage"] = damage_result["damage"]
        result["damage_confidence"] = damage_result["damage_confidence"]
        result["contamination"] = analyze_contamination(file_path)
        material_result = classify_material(file_path)

        result["material"] = material_result["material"]

        result["quality"] = material_result["quality"]

        waste = classify_waste(
            result["condition"],
            result["damage"],
            result["contamination"],
            result["texture"]
        )

        result.update(waste)
        result["recommendation"] = generate_recommendation(result)

        # Save to database
        analysis = TextileAnalysis(
            image_name=image.filename,
            color=result["color"],
            texture=result["texture"],
            pattern=result["pattern"],
            condition=result["condition"],
            damage=result["damage"],
            contamination=result["contamination"],

            material=result["material"],

            quality=result["quality"],

            waste_category=result["waste_category"],
            recyclability=result["recyclability"],
            recommendation=result["recommendation"]
        )

        db.add(analysis)
        db.commit()
        db.refresh(analysis)

        return result

    finally:
        db.close()