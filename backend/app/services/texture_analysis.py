import cv2
import numpy as np


def analyze_texture(image_path):

    image = cv2.imread(image_path)

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Laplacian Variance
    texture_score = cv2.Laplacian(
        gray,
        cv2.CV_64F
    ).var()

    if texture_score < 80:
        return "Smooth"

    elif texture_score < 200:
        return "Medium Texture"

    elif texture_score < 500:
        return "Textured"

    else:
        return "Highly Textured"