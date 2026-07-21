import cv2
import numpy as np


def analyze_condition(image_path):

    image = cv2.imread(image_path)

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Blur to reduce noise
    gray = cv2.GaussianBlur(gray, (5, 5), 0)

    # Detect edges
    edges = cv2.Canny(gray, 80, 180)

    edge_density = np.sum(edges > 0) / edges.size

    # Estimate condition
    if edge_density < 0.03:
        return "Excellent"

    elif edge_density < 0.06:
        return "Good"

    elif edge_density < 0.10:
        return "Fair"

    else:
        return "Needs Inspection"