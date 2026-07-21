import cv2
import numpy as np


def analyze_damage(image_path):
    """
    Analyze textile damage based on edge density.
    Returns:
        Excellent
        Good
        Slightly Damaged
        Damaged
    """

    image = cv2.imread(image_path)

    if image is None:
        return "Unknown"

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    edges = cv2.Canny(blurred, 75, 180)

    edge_pixels = np.count_nonzero(edges)

    total_pixels = gray.shape[0] * gray.shape[1]

    edge_ratio = edge_pixels / total_pixels

    if edge_ratio < 0.02:
        return "Excellent"

    elif edge_ratio < 0.05:
        return "Good"

    elif edge_ratio < 0.08:
        return "Slightly Damaged"

    else:
        return "Damaged"