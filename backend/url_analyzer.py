
import re
import ipaddress
from urllib.parse import urlparse


SUSPICIOUS_KEYWORDS = [
    "login",
    "verify",
    "verification",
    "account",
    "secure",
    "update",
    "password",
    "signin",
    "banking",
    "wallet",
    "confirm",
    "free",
    "gift",
    "prize",
    "suspended",
]

SHORTENER_DOMAINS = [
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "is.gd",
    "shorturl.at",
    "cutt.ly",
    "rb.gy",
]


def analyze_url(url: str):
    url = url.strip()

    if not url:
        raise ValueError("URL cannot be empty.")

    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    try:
        parsed = urlparse(url)
        hostname = parsed.hostname

        if not hostname or "." not in hostname:
            raise ValueError("Invalid website address.")

        # Validate the hostname and port syntax.
        parsed.port

    except ValueError as error:
        raise ValueError("Invalid URL format.") from error

    hostname = hostname.lower()
    reasons = []
    score = 0

    # Feature 1: URL length
    if len(url) > 100:
        score += 10
        reasons.append("Unusually long URL.")

    if len(url) > 200:
        score += 10
        reasons.append("Very long URL structure.")

    # Feature 2: IP address instead of domain
    try:
        ipaddress.ip_address(hostname)
        score += 25
        reasons.append("Website uses an IP address instead of a domain name.")
    except ValueError:
        pass

    # Feature 3: Suspicious @ symbol
    if "@" in parsed.netloc:
        score += 25
        reasons.append("URL contains an @ symbol that may disguise its destination.")

    # Feature 4: Punycode domain
    if "xn--" in hostname:
        score += 20
        reasons.append("Domain contains encoded international characters.")

    # Feature 5: Excessive subdomains
    if hostname.count(".") >= 3:
        score += 15
        reasons.append("Domain contains multiple subdomains.")

    # Feature 6: Suspicious keywords
    found_keywords = [
        keyword
        for keyword in SUSPICIOUS_KEYWORDS
        if re.search(rf"(?<![a-z]){re.escape(keyword)}(?![a-z])", url.lower())
    ]

    if found_keywords:
        score += min(25, len(found_keywords) * 5)
        reasons.append(
            "Suspicious words found: " + ", ".join(found_keywords)
        )

    # Feature 7: URL shortener
    if hostname in SHORTENER_DOMAINS:
        score += 20
        reasons.append("URL uses a public link-shortening service.")

    # Feature 8: Non-standard port
    try:
        port = parsed.port
        if port is not None and port not in (80, 443):
            score += 15
            reasons.append("Website uses a non-standard port.")
    except ValueError:
        pass

    # Feature 9: HTTPS
    if parsed.scheme.lower() != "https":
        score += 10
        reasons.append("Website does not use HTTPS.")

    score = min(score, 100)

    if score >= 60:
        risk_level = "High"
    elif score >= 30:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    return {
        "url": url,
        "hostname": hostname,
        "risk_score": score,
        "risk_level": risk_level,
        "reasons": reasons,
        "analysis_type": "Rule-based heuristic analysis",
        "is_phishing": None,
    }
