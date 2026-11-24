
import re
from urllib.parse import urlparse

URGENT_PHRASES = [
    "immediately",
    "urgent",
    "act now",
    "within 24 hours",
    "account suspended",
    "account blocked",
    "limited time",
    "final warning",
    "verify your account",
    "unusual activity",
]

SENSITIVE_REQUESTS = [
    "password",
    "credit card",
    "bank details",
    "otp",
    "one time password",
    "social security",
    "login credentials",
]

SUSPICIOUS_PHRASES = [
    "you have won",
    "claim your prize",
    "free gift",
    "click here",
    "confirm your identity",
    "update your payment",
    "avoid suspension",
    "congratulations",
]

URL_PATTERN = re.compile(
    r"https?://[^\s<>\"']+|www\.[^\s<>\"']+",
    re.IGNORECASE
)


def analyze_email(email_text: str):
    email_text = email_text.strip()

    if not email_text:
        raise ValueError("Please provide email content.")

    if len(email_text) > 20000:
        raise ValueError("Email content is too long. Maximum 20,000 characters.")

    text = email_text.lower()
    reasons = []
    score = 0

    urgent_found = [
        phrase for phrase in URGENT_PHRASES
        if phrase in text
    ]

    if urgent_found:
        score += min(25, len(urgent_found) * 8)
        reasons.append(
            "Urgent or pressure-based language detected: "
            + ", ".join(urgent_found)
        )

    sensitive_found = [
        phrase for phrase in SENSITIVE_REQUESTS
        if phrase in text
    ]

    if sensitive_found:
        score += min(30, len(sensitive_found) * 10)
        reasons.append(
            "Requests or references to sensitive information detected: "
            + ", ".join(sensitive_found)
        )

    suspicious_found = [
        phrase for phrase in SUSPICIOUS_PHRASES
        if phrase in text
    ]

    if suspicious_found:
        score += min(25, len(suspicious_found) * 8)
        reasons.append(
            "Suspicious email phrases detected: "
            + ", ".join(suspicious_found)
        )

    extracted_urls = URL_PATTERN.findall(email_text)

    suspicious_urls = []

    for raw_url in extracted_urls:
        clean_url = raw_url.rstrip(".,;!?)")
        normalized_url = (
            clean_url if clean_url.lower().startswith(("http://", "https://"))
            else "https://" + clean_url
        )

        hostname = urlparse(normalized_url).hostname

        if not hostname:
            continue

        hostname = hostname.lower()

        if (
            "@" in urlparse(normalized_url).netloc
            or "xn--" in hostname
            or len(normalized_url) > 100
            or hostname.count(".") >= 3
        ):
            suspicious_urls.append(clean_url)

    if suspicious_urls:
        score += min(30, len(suspicious_urls) * 10)
        reasons.append(
            "Potentially suspicious URL structures detected: "
            + ", ".join(suspicious_urls)
        )

    score = min(score, 100)

    if score >= 60:
        risk_level = "High"
    elif score >= 30:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    if not reasons:
        reasons.append(
            "No suspicious indicators were identified by the current rules."
        )

    return {
        "risk_score": score,
        "risk_level": risk_level,
        "reasons": reasons,
        "extracted_urls": extracted_urls,
        "suspicious_urls": suspicious_urls,
        "analysis_type": "Rule-based email heuristic analysis",
    }
