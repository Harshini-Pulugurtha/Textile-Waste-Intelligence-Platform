import cv2
import numpy as np


def analyze_color(image_path):

    image = cv2.imread(image_path)

    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    pixels = hsv.reshape((-1, 3)).astype(np.float32)

    # Remove almost white background
    pixels = pixels[~((pixels[:,1] < 25) & (pixels[:,2] > 220))]

    if len(pixels) == 0:
        return "Unknown"

    # KMeans to find dominant color
    K = 3

    criteria = (
        cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER,
        20,
        1.0
    )

    _, labels, centers = cv2.kmeans(
        pixels,
        K,
        None,
        criteria,
        10,
        cv2.KMEANS_RANDOM_CENTERS
    )

    counts = np.bincount(labels.flatten())

    dominant = centers[np.argmax(counts)]

    h, s, v = dominant

    # ---------- Neutral colors ----------

    if v < 50:
        return "Black"

    if s < 20:
        if v > 220:
            return "White"
        elif v > 150:
            return "Light Gray"
        elif v > 80:
            return "Gray"
        else:
            return "Dark Gray"

    # ---------- Warm colors ----------

    if h < 10 or h >= 170:
        return "Red"

    elif h < 22:
        return "Orange"

    elif h < 35:
        return "Yellow"

    # ---------- Green ----------

    elif h < 85:
        return "Green"

    # ---------- Blue ----------

    elif h < 130:
        return "Blue"

    # ---------- Purple ----------

    elif h < 160:
        return "Purple"

    return "Pink"