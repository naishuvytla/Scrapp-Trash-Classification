import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.timezone import now
import json

import google.generativeai as genai

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not set")
genai.configure(api_key=GEMINI_API_KEY)

MODEL = genai.GenerativeModel("gemini-1.5-flash")

SYSTEM_GUIDE = (
    "You are a recycling and waste-disposal assistant. "
    "Be concise, actionable, and accurate. "
    "Always note that local rules vary and users should check their municipality’s website. "
    "When unsure, ask a clarifying question (e.g., type numbers on plastic, contamination, etc.)."
)

@csrf_exempt
def disposal_chat(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST JSON: {message, label?, instructions?, history?}."}, status=405)

    try:
        body = json.loads(request.body.decode("utf-8"))
    except Exception:
        return JsonResponse({"error": "Invalid JSON body."}, status=400)

    message: str = body.get("message", "").strip()
    label: str | None = body.get("label")
    instructions: str | None = body.get("instructions")
    history = body.get("history", []) 

    if not message:
        return JsonResponse({"error": "Field 'message' is required."}, status=400)

    context_bits = []
    if label:
        context_bits.append(f"Predicted category: {label}")
    if instructions:
        context_bits.append(f"Recommended steps: {instructions}")
    context = "\n".join(context_bits) if context_bits else "No prior classification context."

    gemini_history = []
    for turn in history[-10:]: 
        role = "user" if turn.get("role") == "user" else "model"
        gemini_history.append({"role": role, "parts": [{"text": turn.get("content", "")}]})

    prompt = (
        f"{SYSTEM_GUIDE}\n\n"
        f"Context:\n{context}\n\n"
        f"User message at {now().isoformat()}:\n{message}"
    )

    try:
        chat = MODEL.start_chat(history=gemini_history)
        resp = chat.send_message(prompt)
        text = (resp.text or "").strip()
        return JsonResponse({"reply": text})
    except Exception as e:
        return JsonResponse({"error": f"Gemini call failed: {e}"}, status=500)