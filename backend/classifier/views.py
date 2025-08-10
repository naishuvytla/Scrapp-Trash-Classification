import io
import os
import numpy as np
from PIL import Image, ImageFile
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import tensorflow as tf

try:
    from pillow_heif import register_heif_opener
    register_heif_opener()
except Exception:
    pass  # if not installed, it's fine; JPEG/PNG will still work

# Avoid issues with slightly truncated JPEGs
ImageFile.LOAD_TRUNCATED_IMAGES = True

# === Model + labels load once at import ===
HERE = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(HERE)  # .../backend
EXPORT_DIR = os.path.join(BASE_DIR, "export")
MODEL_PATH = os.path.join(EXPORT_DIR, "scrapp-trash-model.keras")
LABELS_PATH = os.path.join(EXPORT_DIR, "labels.txt")

MODEL = tf.keras.models.load_model(MODEL_PATH)
CLASS_NAMES = [l.strip() for l in open(LABELS_PATH, "r").read().splitlines()]

INSTRUCTIONS = {
    "cardboard": (
        "Flatten all cardboard boxes to save space and keep them dry to maintain recyclability. "
        "Remove any plastic tape, labels, or packing materials if possible. "
        "Place in your curbside recycling bin or take to a designated recycling drop-off center."
    ),
    "glass": (
        "Rinse glass bottles and jars thoroughly to remove food or liquid residue. "
        "Separate by color if required by your local recycling program. "
        "Avoid breaking the glass, and never include ceramics, lightbulbs, or tempered glass. "
        "Place in glass recycling or mixed recyclables as per your municipality’s rules."
    ),
    "metal": (
        "Empty and rinse all metal cans, tins, or containers. "
        "Crush cans to save space if allowed. "
        "Remove paper labels if possible, but it’s not always required. "
        "Place clean metal items into your recycling bin or take them to a scrap metal collection point."
    ),
    "paper": (
        "Recycle clean, dry paper such as newspapers, magazines, printer paper, and envelopes. "
        "Avoid recycling paper contaminated with grease, food, or heavy coatings. "
        "Stack or bundle large sheets for easier processing. "
        "Place in your curbside recycling bin or a designated paper recycling container."
    ),
    "plastic": (
        "Rinse all plastic containers to remove food or liquid residue. "
        "Check the recycling code (#1 through #7) and confirm with your local recycling guidelines "
        "which types are accepted. Remove caps and lids unless instructed otherwise. "
        "Flatten bottles to save space before placing them in the recycling bin."
    ),
    "trash": (
        "Place non-recyclable items in the general waste bin for landfill disposal. "
        "Avoid mixing hazardous materials, electronics, or batteries with household trash. "
        "Check if any items can be repurposed or disposed of through special waste programs "
        "before discarding."
    ),
}

def _preprocess(pil_img, size=(64, 64)):
    img = pil_img.convert("RGB").resize(size)
    x = np.array(img, dtype=np.float32)
    return np.expand_dims(x, 0)

@csrf_exempt
def classify(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST an image file to this endpoint."}, status=405)

    file = request.FILES.get("image")
    if not file:
        return JsonResponse({"error": "Missing 'image' file (multipart/form-data)."}, status=400)

    # DEBUG: log what we received
    try:
        print("upload name:", getattr(file, "name", None))
        print("content_type:", getattr(file, "content_type", None))
        print("size:", getattr(file, "size", None))
    except Exception:
        pass

    try:
        # Read the raw bytes first, then open via BytesIO (more reliable than passing the file object)
        raw = file.read()
        pil_img = Image.open(io.BytesIO(raw))
        x = _preprocess(pil_img)

        logits = MODEL(x)
        probs = tf.nn.softmax(logits, axis=-1).numpy()[0]
        idx = int(np.argmax(probs))
        label = CLASS_NAMES[idx]
        conf = float(probs[idx])

        return JsonResponse({
            "label": label,
            "confidence": conf,
            "probs": {CLASS_NAMES[i]: float(p) for i, p in enumerate(probs)},
            "instructions": INSTRUCTIONS.get(label, "Check local guidance."),
        })
    except Exception as e:
        return JsonResponse({"error": f"Failed to classify: {e}"}, status=500)