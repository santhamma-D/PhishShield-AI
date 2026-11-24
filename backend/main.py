from database import init_db, save_scan, get_scan_history
import json
from email_analyzer import analyze_email
from sms_analyzer import analyze_sms
from qr_analyzer import analyze_qr_content
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from urllib.parse import urlparse
from url_analyzer import analyze_url
from brand_analyzer import analyze_brand_url
from ml_analyzer import predict_phishing
from security_copilot import get_security_advice


app = FastAPI(
    title="PHISHSHIELD AI",
    description="AI-powered cybersecurity and phishing detection platform",
    version="1.0.0"
)
@app.on_event("startup")
def startup_event():
    init_db()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Allow the React frontend to communicate with this backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class URLScanRequest(BaseModel):
    url: str

class EmailScanRequest(BaseModel):
    email_text: str

class SMSScanRequest(BaseModel):
    sms_text: str

class QRScanRequest(BaseModel):
    qr_content: str

class BrandScanRequest(BaseModel):
    url: str

class CopilotRequest(BaseModel):
    question: str

@app.get("/")
def home():
    return {
        "message": "Welcome to PHISHSHIELD AI Backend",
        "status": "running"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "application": "PHISHSHIELD AI"
    }


@app.post("/api/scan-url")
def scan_url(request: URLScanRequest):
    submitted_url = request.url.strip()

    if not submitted_url:
        return {
            "success": False,
            "message": "Please provide a URL."
        }

    try:
        result = analyze_url(submitted_url)

        save_scan(
            scan_type="URL",
            input_value=submitted_url,
            risk_level=result.get("risk_level", "Unknown"),
            result=json.dumps(result)
        )

        return {
            "success": True,
            **result
        }

    except ValueError as error:
        return {
            "success": False,
            "message": str(error)
        }


@app.post("/api/scan-sms")
def scan_sms(request: SMSScanRequest):
    submitted_sms = request.sms_text.strip()

    if not submitted_sms:
        return {
            "success": False,
            "message": "Please provide SMS message content."
        }

    try:
        result = analyze_sms(submitted_sms)

        save_scan(
            scan_type="SMS",
            input_value=submitted_sms,
            risk_level=result.get("risk_level", "Unknown"),
            result=json.dumps(result)
        )

        return {
            "success": True,
            **result
        }

    except ValueError as error:
        return {
            "success": False,
            "message": str(error)
        }

    except Exception as error:
        print(f"SMS analysis error: {error}")
        return {
            "success": False,
            "message": "An unexpected error occurred during SMS analysis."
        }


@app.post("/api/scan-email")
def scan_email(request: EmailScanRequest):

    submitted_email = request.email_text.strip()

    if not submitted_email:
        return {
            "success": False,
            "message": "Please provide email content."
        }

    try:
        result = analyze_email(submitted_email)

        save_scan(
            scan_type="Email",
            input_value=submitted_email,
            risk_level=result.get("risk_level", "Unknown"),
            result=json.dumps(result)
        )

        return {
            "success": True,
            **result
        }

    except ValueError as error:
        return {
            "success": False,
            "message": str(error)
        }

    except Exception as error:
        print(f"Email analysis error: {error}")
        return {
            "success": False,
            "message": "An unexpected error occurred during email analysis."
        }



@app.post("/api/scan-qr")
def scan_qr(request: QRScanRequest):
    submitted_content = request.qr_content.strip()

    if not submitted_content:
        return {
            "success": False,
            "message": "Please provide QR code content."
        }

    try:
        result = analyze_qr_content(submitted_content)

        save_scan(
            scan_type="QR",
            input_value=submitted_content,
            risk_level=result.get("risk_level", result.get("risk", "Unknown")),
            result=json.dumps(result)
        )

        return {
            "success": True,
            **result
        }

    except ValueError as error:
        return {
            "success": False,
            "message": str(error)
        }

    except Exception as error:
        print(f"QR analysis error: {error}")
        return {
            "success": False,
            "message": "An unexpected error occurred during QR analysis."
        }


@app.post("/api/scan-brand")
def scan_brand(request: BrandScanRequest):
    submitted_url = request.url.strip()

    if not submitted_url:
        return {
            "success": False,
            "message": "Please enter a website URL."
        }

    try:
        result = analyze_brand_url(submitted_url)

        save_scan(
            scan_type="Brand",
            input_value=submitted_url,
            risk_level=result.get("risk", "Unknown"),
            result=json.dumps(result)
        )

        return {
            "success": True,
            **result
        }

    except ValueError as error:
        return {
            "success": False,
            "message": str(error)
        }

    except Exception as error:
        print(f"Brand analysis error: {error}")
        return {
            "success": False,
            "message": "An unexpected error occurred."
        }

@app.post("/api/scan-url-ml")
def scan_url_ml(request: URLScanRequest):
    submitted_url = request.url.strip()

    if not submitted_url:
        return {
            "success": False,
            "message": "Please provide a URL."
        }

    try:
        result = predict_phishing(submitted_url)

        return {
            "success": True,
            **result
        }

    except FileNotFoundError as error:
        return {
            "success": False,
            "message": str(error)
        }

    except Exception as error:
        print(f"ML prediction error: {error}")
        return {
            "success": False,
            "message": "An unexpected ML prediction error occurred."
        }

@app.post("/api/security-copilot")
def security_copilot(request: CopilotRequest):
    try:
        result = get_security_advice(request.question)
        return result
    except Exception as error:
        print(f"Security Copilot error: {error}")
        return {
            "success": False,
            "answer": "Unable to process your question right now."
        }
@app.get("/api/scan-history")
def scan_history():
    return {
        "success": True,
        "history": get_scan_history()
    }