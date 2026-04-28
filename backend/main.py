from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os, re, json, requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("OPENROUTER_API_KEY")


class AnalyzeRequest(BaseModel):
    message: str
    category: str


@app.post("/analyze")
def analyze(data: AnalyzeRequest):
    msg = data.message.lower()

    # easy deterministic cases first
    if "broken" in msg or "damaged" in msg:
        return response_pack(
            "Damaged Item",
            "Refund",
            "High",
            0.94,
            "Priority Returns Team",
            ["Order ID", "Photo of Damage"]
        )

    if "wrong" in msg or "size" in msg:
        return response_pack(
            "Wrong Item Sent",
            "Exchange",
            "Low",
            0.92,
            "Returns Team",
            ["Order ID", "Photo of Received Item"]
        )

    # ambiguous -> LLM
    return llm_reason(data.message, data.category)


def llm_reason(message, category):
    if not API_KEY:
        return response_pack(
            "Return Request",
            "Manual Review",
            "Medium",
            0.72,
            "Support Team",
            ["Order ID", "More Details"]
        )

    prompt = f"""
You are an ecommerce returns analyst for Mumzworld.

Analyze this request:

Message: {message}
Category: {category}

Return ONLY valid JSON:

{{
 "intent":"",
 "resolution":"",
 "urgency":"",
 "confidence":0.0,
 "queue":"",
 "requiredInputs":[""]
}}
"""

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "qwen/qwen-2.5-72b-instruct",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.2
    }

    try:
        r = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )

        raw = r.json()
        content = raw["choices"][0]["message"]["content"].strip()
        content = content.replace("```json", "").replace("```", "").strip()
        parsed = json.loads(content)

        return response_pack(
            parsed["intent"],
            parsed["resolution"],
            parsed["urgency"],
            parsed["confidence"],
            parsed["queue"],
            parsed["requiredInputs"]
        )

    except:
        return response_pack(
            "Return Request",
            "Escalate",
            "Medium",
            0.65,
            "Manual Review Team",
            ["Order ID"]
        )


def response_pack(intent, resolution, urgency, confidence, queue, req):
    return {
        "language": "English",
        "intent": intent,
        "resolution": resolution,
        "eligibility": "Likely Eligible",
        "urgency": urgency,
        "confidence": confidence,
        "fraudRisk": "Low",
        "queue": queue,
        "requiredInputs": req,
        "replyEn": f"Please share your order details so we can proceed regarding {intent.lower()}.",
        "replyAr": "يرجى مشاركة تفاصيل الطلب حتى نتمكن من المتابعة.",
    }