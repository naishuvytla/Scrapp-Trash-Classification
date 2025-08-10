import tensorflow as tf
import numpy as np
from PIL import Image

MODEL_PATH = "export/scrapp-trash-model.keras"
LABELS_PATH = "export/labels.txt"

model = tf.keras.models.load_model(MODEL_PATH)
labels = [l.strip() for l in open(LABELS_PATH).read().splitlines()]

def predict(path):
    img = Image.open(path).convert("RGB").resize((64,64))
    x = np.array(img, dtype=np.float32)
    x = np.expand_dims(x, 0)  
    logits = model(x)
    probs = tf.nn.softmax(logits, axis=-1).numpy()[0]
    idx = int(np.argmax(probs))
    return labels[idx], float(probs[idx])