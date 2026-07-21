import cv2
import mediapipe as mp
import os

mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=True)


TOP_WEAR = {
    "Blouses_Shirts",
    "Cardigans",
    "Graphic_Tees",
    "Jackets_Coats",
    "Jackets_Vests",
    "Shirts_Polos",
    "Sweaters",
    "Sweatshirts_Hoodies",
    "Tees_Tanks",
}

BOTTOM_WEAR = {
    "Denim",
    "Leggings",
    "Pants",
    "Shorts",
    "Skirts",
}

FULL_BODY = {
    "Dresses",
    "Rompers_Jumpsuits",
}


def crop_garment(image_path, garment_name):

    image = cv2.imread(image_path)

    if image is None:
        return image_path

    h, w, _ = image.shape

    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = pose.process(rgb)

    if not results.pose_landmarks:
        print("Pose not detected. Using original image.")
        return image_path

    lm = results.pose_landmarks.landmark

    def pt(id):
        return (
            int(lm[id].x * w),
            int(lm[id].y * h),
        )

    left_shoulder = pt(11)
    right_shoulder = pt(12)

    left_hip = pt(23)
    right_hip = pt(24)

    left_knee = pt(25)
    right_knee = pt(26)

    xs = []

    ys = []

    if garment_name in TOP_WEAR:

        xs = [
            left_shoulder[0],
            right_shoulder[0],
            left_hip[0],
            right_hip[0],
        ]

        ys = [
            left_shoulder[1],
            right_shoulder[1],
            left_hip[1],
            right_hip[1],
        ]

    elif garment_name in BOTTOM_WEAR:

        xs = [
            left_hip[0],
            right_hip[0],
            left_knee[0],
            right_knee[0],
        ]

        ys = [
            left_hip[1],
            right_hip[1],
            left_knee[1],
            right_knee[1],
        ]

    else:

        xs = [
            left_shoulder[0],
            right_shoulder[0],
            left_knee[0],
            right_knee[0],
        ]

        ys = [
            left_shoulder[1],
            right_shoulder[1],
            left_knee[1],
            right_knee[1],
        ]

    margin = 40

    x1 = max(0, min(xs) - margin)
    y1 = max(0, min(ys) - margin)

    x2 = min(w, max(xs) + margin)
    y2 = min(h, max(ys) + margin)

    crop = image[y1:y2, x1:x2]

    cropped_path = os.path.splitext(image_path)[0] + "_crop.jpg"

    cv2.imwrite(cropped_path, crop)

    print("Garment cropped:", cropped_path)

    return cropped_path