import os
import json
import numpy as np
from PIL import Image
import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

# ==========================================
# Paths
# ==========================================

BASE_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..")
)

DAMAGE_MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "damage_model.keras"
)

DAMAGE_CLASSES_PATH = os.path.join(
    BASE_DIR,
    "models",
    "damage_classes.json"
)

# ==========================================
# Load Model
# ==========================================


damage_model = tf.keras.models.load_model(DAMAGE_MODEL_PATH)

with open(DAMAGE_CLASSES_PATH, "r") as f:
    DAMAGE_CLASSES = json.load(f)

print("Loaded Damage Model:", DAMAGE_MODEL_PATH)


def predict_damage(image_path):

    # Load image
    image = Image.open(image_path).convert("RGB")
    image = image.resize((224, 224))

    # Preprocess (same as training)
    image = np.array(image).astype(np.float32)
    image = preprocess_input(image)
    image = np.expand_dims(image, axis=0)

    # Predict
    prediction = float(damage_model.predict(image, verbose=0)[0][0])

    # Class mapping:
    # 0 = Defect
    # 1 = Normal
    normal_prob = prediction
    defect_prob = 1 - prediction

    print("\n========== DAMAGE PREDICTION ==========")
    print(f"Raw Sigmoid Output : {prediction:.4f}")
    print(f"Normal Probability : {normal_prob * 100:.2f}%")
    print(f"Defect Probability : {defect_prob * 100:.2f}%")
    print("=======================================\n")

    THRESHOLD = 0.50

    if normal_prob >= THRESHOLD:
        damage = "Normal"
        confidence = normal_prob * 100
    else:
        damage = "Defect"
        confidence = defect_prob * 100

    print(f"Prediction : {damage}")
    print(f"Confidence : {confidence:.2f}%")

    return {
        "damage": damage,
        "damage_confidence": round(confidence, 2)
    }