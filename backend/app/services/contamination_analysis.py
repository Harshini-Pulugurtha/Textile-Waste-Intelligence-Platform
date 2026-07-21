import cv2
import numpy as np


def analyze_contamination(image_path):
    """
    Heuristic contamination detector.
    """

    image = cv2.imread(image_path)

    if image is None:
        return "Unknown"

    image = cv2.resize(image, (256, 256))

    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    h, s, v = cv2.split(hsv)

    # Remove white background
    mask = ~((s < 20) & (v > 230))

    if np.sum(mask) == 0:
        return "Unknown"

    v = v[mask]
    s = s[mask]

    brightness = np.mean(v)

    # Very dark pixels
    dark_ratio = np.sum(v < 45) / len(v)

    # Very bright pixels
    bright_ratio = np.sum(v > 220) / len(v)

    # Color variation
    saturation = np.mean(s)

    # -------------------------

    if dark_ratio > 0.50:
        return "Highly Contaminated"

    elif dark_ratio > 0.30:
        return "Dusty"

    elif dark_ratio > 0.12 and brightness < 100:
        return "Slightly Dirty"

    else:
        return "Clean"