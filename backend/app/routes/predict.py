import cv2
import numpy as np


def analyze_damage(image_path):

    image = cv2.imread(image_path)

    if image is None:
        return "Unknown"

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    edges = cv2.Canny(gray, 80, 180)

    edge_pixels = np.count_nonzero(edges)

    total_pixels = gray.shape[0] * gray.shape[1]

    ratio = edge_pixels / total_pixels

    if ratio < 0.02:
        return "Excellent"

    elif ratio < 0.05:
        return "Good"

    elif ratio < 0.08:
        return "Slightly Damaged"

    else:
        return "Damaged"