
import re
from urllib.parse import urlparse


URGENT_PHRASES = [
    "act now",
    "immediately",
    "urgent",
    "within 24 hours",
    "account suspended",
    "account blocked",
    "limited time",
    "final warning",
    "verify immediately",
    "your account will be closed",
]

FINANCIAL_PHRASES = [
    "bank account",
    "credit card",
    "debit card",
    "bank details",
    "payment details",
    "account number",
    "upi pin",
    "cvv",
]

CREDENTIAL_PHRASES = [
    "password",
    "otp",
    "one time password",
    "verification code",
    "login credentials",
    "pin number",
]

SCAM_PHRASES = [
    "you have won",
    "claim your prize",
    "free gift",
    "lottery winner",
    "cash prize",
    "click this link",
    "claim now",
    "kyc update",
    "kyc expired",
    "job offer",
    "work from home",
    "investment opportunity",
    "guaranteed returns",
]

URL_PATTERN = re.compile(
    r"https?://[^\s]+|www\.[^\s]+",
    re.IGNORECASE,
)

URL_SHORTENERS = [
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "shorturl.at",
    "cutt.ly",
    "is.gd",
]


def analyze_sms(sms_text: str):
    if not isinstance(sms_text, str) or not sms_text.strip():
        raise ValueError("Please provide SMS message content.")

    sms_text = sms_text.strip()

    if len(sms_text) > 10000:
        raise ValueError("SMS content must not exceed 10,000 characters.")

    text = sms_text.lower()
    risk_score = 0
    reasons = []

    for phrase in URGENT_PHRASES:
        if phrase in text:
            risk_score += 15
            reasons.append(
                f"Urgent or threatening language detected: '{phrase}'."
            )

    for phrase in FINANCIAL_PHRASES:
        if phrase in text:
            risk_score += 20
            reasons.append(
                f"Financial information request detected: '{phrase}'."
            )

    for phrase in CREDENTIAL_PHRASES:
        if phrase in text:
            risk_score += 20
            reasons.append(
                f"Sensitive credential-related phrase detected: '{phrase}'."
            )

    for phrase in SCAM_PHRASES:
        if phrase in text:
            risk_score += 15
            reasons.append(
                f"Potential scam-related phrase detected: '{phrase}'."
            )

    extracted_urls = URL_PATTERN.findall(sms_text)
    suspicious_urls = []

    for url in extracted_urls:
        normalized_url = url.rstrip(".,!?;:)")

        parsed_url = urlparse(
            normalized_url
            if normalized_url.lower().startswith(("http://", "https://"))
            else "http://" + normalized_url
        )

        hostname = (parsed_url.hostname or "").lower()

        if normalized_url.lower().startswith("http://"):
            suspicious_urls.append(normalized_url)
            risk_score += 15
            reasons.append("A non-secure HTTP link was found.")

        if hostname in URL_SHORTENERS:
            suspicious_urls.append(normalized_url)
            risk_score += 20
            reasons.append("A shortened URL was detected.")

    suspicious_urls = list(dict.fromkeys(suspicious_urls))
    risk_score = min(risk_score, 100)

    if risk_score >= 60:
        risk_level = "High"
    elif risk_score >= 30:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    if not reasons:
        reasons.append(
            "No known suspicious indicators were detected by the current rules."
        )

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "reasons": reasons,
        "extracted_urls": extracted_urls,
        "suspicious_urls": suspicious_urls,
        "analysis_type": "Rule-Based SMS Analysis",
    }
