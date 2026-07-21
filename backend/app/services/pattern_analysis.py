import cv2
import numpy as np


def analyze_pattern(image_path):

    image = cv2.imread(image_path)

    if image is None:
        return "Unknown"

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Slight blur to reduce noise
    gray = cv2.GaussianBlur(gray, (5, 5), 0)

    edges = cv2.Canny(gray, 80, 180)

    lines = cv2.HoughLinesP(
        edges,
        1,
        np.pi / 180,
        threshold=100,
        minLineLength=60,
        maxLineGap=15
    )

    if lines is None:
        return "Plain"

    horizontal = 0
    vertical = 0

    for line in lines.reshape(-1, 4):

        x1, y1, x2, y2 = line

        length = np.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

        # Ignore very short lines
        if length < 60:
            continue

        angle = abs(np.degrees(np.arctan2(y2 - y1, x2 - x1)))

        if angle < 10 or angle > 170:
            horizontal += 1

        elif 80 < angle < 100:
            vertical += 1

    # Decision Logic
    if horizontal < 5 and vertical < 5:
        return "Plain"

    if horizontal >= 15 and vertical >= 15:
        return "Checkered"

    if horizontal >= 15 or vertical >= 15:
        return "Striped"

    return "Printed"