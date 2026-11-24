
import re
import joblib

from pathlib import Path
from urllib.parse import urlparse

MODEL_PATH = Path(__file__).with_name("phishing_model.pkl")

def extract_features(url):
    url = str(url).lower()
    parsed = urlparse(url if "://" in url else "http://" + url)
    hostname = parsed.hostname or ""

    return [[
        len(url),
        len(hostname),
        url.count("."),
        url.count("-"),
        url.count("@"),
        url.count("?"),
        url.count("="),
        url.count("/"),
        int(parsed.scheme == "https"),
        int(bool(re.search(r"\d+\.\d+\.\d+\.\d+", hostname))),
        int(any(word in url for word in [
            "login", "verify", "secure", "account",
            "update", "bank", "confirm", "password"
        ]))
    ]]


def explain_url(url):
    parsed = urlparse(url if "://" in url else "http://" + url)
    hostname = parsed.hostname or ""
    reasons = []

    if parsed.scheme != "https":
        reasons.append("The URL does not use HTTPS.")

    if re.search(r"\d+\.\d+\.\d+\.\d+", hostname):
        reasons.append("The URL uses an IP address instead of a domain name.")

    if "@" in url:
        reasons.append("The URL contains an @ symbol, which can hide the destination.")

    if url.count("-") >= 2:
        reasons.append("The URL contains multiple hyphens.")

    suspicious_words = [
        "login", "verify", "secure", "account",
        "update", "bank", "confirm", "password"
    ]

    found_words = [word for word in suspicious_words if word in url.lower()]

    if found_words:
        reasons.append(
            "Suspicious keywords detected: " + ", ".join(found_words)
        )

    if len(url) > 75:
        reasons.append("The URL is unusually long.")

    if not reasons:
        reasons.append("No suspicious URL patterns were found by these checks.")

    return reasons


def predict_phishing(url):
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            "Trained model not found. Run python train_model.py first."
        )

    model = joblib.load(MODEL_PATH)
    features = extract_features(url)

    prediction = int(model.predict(features)[0])
    probabilities = model.predict_proba(features)[0]

    phishing_index = list(model.classes_).index(1)
    confidence = round(
        float(probabilities[phishing_index]) * 100, 2
    )

    return {
        "prediction": "Phishing" if prediction == 1 else "Legitimate",
        "label": prediction,
        "confidence": confidence,
        "model": "Random Forest",
        "reasons": explain_url(url)
    }

