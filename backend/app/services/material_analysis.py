# import cv2
# import numpy as np


# def classify_material(image_path):
#     """
#     Simple heuristic material classifier.
#     Replace later with a trained AI model.
#     """

#     image = cv2.imread(image_path)

#     if image is None:
#         return {
#             "material": "Unknown",
#             "fiber_composition": "Unknown",
#             "quality": "Unknown"
#         }

#     hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

#     brightness = np.mean(hsv[:, :, 2])

#     saturation = np.mean(hsv[:, :, 1])

#     if brightness > 170 and saturation < 70:
#         return {
#             "material": "Cotton",
#             "fiber_composition": "Cotton",
#             "quality": "High"
#         }

#     elif saturation > 120:
#         return {
#             "material": "Polyester",
#             "fiber_composition": "Polyester",
#             "quality": "Medium"
#         }

#     elif brightness < 90:
#         return {
#             "material": "Denim",
#             "fiber_composition": "Cotton Blend",
#             "quality": "High"
#         }

#     else:
#         return {
#             "material": "Mixed Fabric",
#             "fiber_composition": "Poly-Cotton Blend",
#             "quality": "Standard"
#         }
import cv2
import numpy as np


def classify_material(image_path):
    """
    Simple heuristic material classifier.
    Replace later with a trained AI model.
    """

    image = cv2.imread(image_path)

    if image is None:
        return {
            "material": "Unknown",
            "quality": "Unknown"
        }

    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    brightness = np.mean(hsv[:, :, 2])
    saturation = np.mean(hsv[:, :, 1])

    if brightness > 170 and saturation < 70:
        return {
            "material": "Cotton",
            "quality": "High"
        }

    elif saturation > 120:
        return {
            "material": "Polyester",
            "quality": "Medium"
        }

    elif brightness < 90:
        return {
            "material": "Denim",
            "quality": "High"
        }

    else:
        return {
            "material": "Mixed Fabric",
            "quality": "Standard"
        }