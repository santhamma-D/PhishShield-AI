
from urllib.parse import urlparse
from difflib import SequenceMatcher

TRUSTED_BRANDS = {
    "Google": "google.com",
    "Microsoft": "microsoft.com",
    "Amazon": "amazon.com",
    "PayPal": "paypal.com",
    "Apple": "apple.com",
    "Facebook": "facebook.com",
    "Instagram": "instagram.com",
    "Netflix": "netflix.com",
}

def analyze_brand_url(url: str):
    url = url.strip()

    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    parsed = urlparse(url)
    hostname = (parsed.hostname or "").lower().strip(".")

    if not hostname:
        raise ValueError("Please enter a valid website URL.")

    if hostname.startswith("www."):
        hostname = hostname[4:]

    # Check whether the URL belongs to an official brand domain
    for brand, official_domain in TRUSTED_BRANDS.items():
        if hostname == official_domain or hostname.endswith("." + official_domain):
            return {
                "brand": brand,
                "status": "Official domain",
                "risk": "Low",
                "score": 5,
                "message": f"This URL uses the official {brand} domain."
            }

    # Check for suspicious domain lookalikes
    domain_name = hostname.split(".")[0]
    best_match = None
    best_similarity = 0

    for brand, official_domain in TRUSTED_BRANDS.items():
        official_name = official_domain.split(".")[0]
        similarity = SequenceMatcher(
            None, domain_name, official_name
        ).ratio()

        if similarity > best_similarity:
            best_similarity = similarity
            best_match = brand

    if best_similarity >= 0.75:
        return {
            "brand": best_match,
            "status": "Possible brand impersonation",
            "risk": "High",
            "score": 90,
            "message": f"This domain looks similar to the official {best_match} domain. Be careful."
        }

    return {
        "brand": "Unknown",
        "status": "No known brand match",
        "risk": "Uncertain",
        "score": 30,
        "message": "No known brand impersonation pattern was detected. This does not guarantee the website is safe."
    }
