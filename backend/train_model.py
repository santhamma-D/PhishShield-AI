
import pandas as pd
import re
import joblib

from urllib.parse import urlparse
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report


def extract_features(url):
    url = str(url).lower()

    parsed = urlparse(url if "://" in url else "http://" + url)
    hostname = parsed.netloc.split("@")[-1].split(":")[0]

    return [
        len(url),
        len(hostname),
        url.count("."),
        url.count("-"),
        url.count("@"),
        url.count("?"),
        url.count("="),
        url.count("/"),
        int("https" in url),
        int(bool(re.search(r"\d+\.\d+\.\d+\.\d+", hostname))),
        int(any(word in url for word in [
            "login", "verify", "secure", "account",
            "update", "bank", "confirm", "password"
        ]))
    ]


data = pd.read_csv("phishing_dataset.csv")

X = data["url"].apply(extract_features).tolist()
y = data["label"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.25,
    random_state=42,
    stratify=y
)

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    class_weight="balanced"
)

model.fit(X_train, y_train)

predictions = model.predict(X_test)

print("Model Accuracy:", accuracy_score(y_test, predictions))
print("\nClassification Report:")
print(classification_report(y_test, predictions, zero_division=0))

joblib.dump(model, "phishing_model.pkl")

print("\nModel saved successfully as phishing_model.pkl")
