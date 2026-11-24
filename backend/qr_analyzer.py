
import re
from urllib.parse import urlparse


SUSPICIOUS_KEYWORDS = [
    "login", "verify", "account", "secure", "update",
    "banking", "password", "signin", "wallet",
    "payment", "confirm", "free", "prize"
]

SHORTENED_DOMAINS = [
    "bit.ly", "tinyurl.com", "t.co", "is.gd",
    "cutt.ly", "shorturl.at", "ow.ly"
]


def analyze_qr_content(qr_content: str):
    content = qr_content.strip()

    if not content:
        raise ValueError("No QR code content was detected.")

    if len(content) > 10000:
        raise ValueError("QR code content is too long.")

    risk_score = 0
    reasons = []
    extracted_url = None
    hostname = None

    # Check whether the QR code contains a URL.
    possible_url = content

    if content.lower().startswith("www."):
        possible_url = "https://" + content

    parsed = urlparse(possible_url)

    if parsed.scheme.lower() in ["http", "https"] and parsed.hostname:
        extracted_url = possible_url
        hostname = parsed.hostname.lower()

        if parsed.scheme.lower() != "https":
            risk_score += 20
            reasons.append("The website does not use HTTPS encryption.")

        if re.match(r"^\d{1,3}(\.\d{1,3}){3}$", hostname):
            risk_score += 30
            reasons.append("The URL uses an IP address instead of a domain name.")

        if "@" in parsed.netloc:
            risk_score += 30
            reasons.append("The URL contains an @ symbol, which can hide its destination.")

        if "xn--" in hostname:
            risk_score += 30
            reasons.append("The domain uses encoded characters that may imitate another website.")

        if hostname in SHORTENED_DOMAINS:
            risk_score += 25
            reasons.append("The URL uses a shortened link that hides its destination.")

        for keyword in SUSPICIOUS_KEYWORDS:
            if keyword in content.lower():
                risk_score += 10
                reasons.append(
                    f"The URL contains a potentially suspicious keyword: {keyword}."
                )
                break

    else:
        reasons.append("The QR code contains text rather than a recognized HTTP or HTTPS URL.")

    risk_score = min(risk_score, 100)

    if risk_score >= 60:
        risk_level = "High"
    elif risk_score >= 30:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    return {
        "qr_content": content,
        "extracted_url": extracted_url,
        "hostname": hostname,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "reasons": reasons,
        "analysis_type": "Rule-Based QR Security Analysis"
    }
