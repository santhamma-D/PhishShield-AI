
import API_BASE_URL from "../api";
import { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  Globe,
  Lock,
  AlertTriangle,
  ArrowLeft,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./URLScanner.css";


interface ScanResult {
  success: boolean;
  url: string;
  hostname: string;
  risk_score: number;
  risk_level: "Low" | "Medium" | "High";
  reasons: string[];
  analysis_type: string;
  is_phishing: boolean | null;
}
interface MLResult {
  success: boolean;
  prediction: "Phishing" | "Legitimate";
  label: number;
  confidence: number;
  model: string;
  reasons: string[];
}

function URLScanner() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [mlResult, setMlResult] = useState<MLResult | null>(null);

  const handleScan = async () => {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setMessage("Please enter a website URL.");
      setResult(null);
      setMlResult(null);
      return;
    }

    setLoading(true);
    setMessage("");
    setResult(null);
    setMlResult(null);

    try {
      const response = await fetch(
       `${API_BASE_URL}/api/scan-url`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: trimmedUrl,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || data.detail || "Unable to analyze this URL."
        );
      }

      setResult(data as ScanResult);
      // Run the Machine Learning analysis
try {
  const mlResponse = await fetch(
   `${API_BASE_URL}/api/scan-url-ml`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: trimmedUrl,
      }),
    }
  );

  const mlData = await mlResponse.json();

  if (mlResponse.ok && mlData.success) {
    setMlResult(mlData as MLResult);
  } else {
    console.error("ML analysis failed:", mlData.message);
  }
} catch (mlError) {
  console.error("ML connection error:", mlError);
}
    } catch (error) {
      console.error("URL scan error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to connect to the backend. Check that your FastAPI server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const riskClass = result?.risk_level.toLowerCase() ?? "";

  return (
    <div className="scanner-page">
      <nav className="scanner-nav">
        <Link to="/dashboard" className="scanner-back">
          <ArrowLeft size={18} /> Dashboard
        </Link>

        <h2>
          <ShieldCheck size={24} /> PHISHSHIELD AI
        </h2>

        <span className="scanner-label">URL SECURITY</span>
      </nav>

      <main className="scanner-container">
        <div className="scanner-heading">
          <span className="scanner-eyebrow">
            AI-POWERED PROTECTION
          </span>

          <h1>
            Website <span>URL Scanner</span>
          </h1>

          <p>
            Analyze suspicious website addresses and identify
            potential phishing indicators.
          </p>
        </div>

        <section className="scanner-card">
          <div className="scanner-icon">
            <Globe size={34} />
          </div>

          <h2>Analyze a website URL</h2>

          <p>Enter the website address you want to check.</p>

          <div className="url-input-wrapper">
            <Globe size={20} />

            <input
              type="text"
              value={url}
              onChange={(event) => {
                setUrl(event.target.value);
                setMessage("");
                setResult(null);
                setMlResult(null);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !loading) {
                  handleScan();
                }
              }}
              placeholder="https://example.com"
              aria-label="Website URL"
            />
          </div>

          <button
            className="scan-button"
            onClick={handleScan}
            disabled={loading}
          >
            <Search size={19} />
            {loading ? "Analyzing..." : "Check URL"}
          </button>

          {loading && (
            <div className="scanner-message" role="status">
              <Activity size={18} />
              Analyzing website security indicators...
            </div>
          )}

          {message && (
            <div className="scanner-message error-message" role="alert">
              <AlertTriangle size={18} />
              {message}
            </div>
          )}

          <div className="scanner-privacy">
            <Lock size={15} />
            Do not enter passwords or confidential information.
          </div>
        </section>

        {result && (
          <section className={`scan-result ${riskClass}`}>
            <div className="result-header">
              <div>
                <span className="result-eyebrow">
                  SCAN COMPLETED
                </span>

                <h2>Security Analysis Result</h2>
              </div>

              {result.risk_level === "High" ? (
                <ShieldAlert size={32} />
              ) : result.risk_level === "Medium" ? (
                <AlertTriangle size={32} />
              ) : (
                <ShieldCheck size={32} />
              )}
            </div>

            <div className="result-website">
              <span>Analyzed website</span>
              <strong>{result.hostname}</strong>
              <small>{result.url}</small>
            </div>

            <div className="risk-overview">
              <div className="risk-score">
                <span>RISK SCORE</span>
                <strong>{result.risk_score}</strong>
                <small>out of 100</small>
              </div>

              <div className="risk-level">
                <span>RISK LEVEL</span>
                <strong>{result.risk_level}</strong>
                <small>
                  {result.risk_level === "High"
                    ? "Multiple warning indicators detected"
                    : result.risk_level === "Medium"
                    ? "Some suspicious indicators detected"
                    : "Few warning indicators detected"}
                </small>
              </div>
            </div>

            <div className="risk-progress">
              <div
                className="risk-progress-fill"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, result.risk_score)
                  )}%`,
                }}
              />
            </div>

            <div className="result-reasons">
              <h3>
                <AlertTriangle size={19} />
                Analysis Findings
              </h3>

              {result.reasons.length > 0 ? (
                <ul>
                  {result.reasons.map((reason, index) => (
                    <li key={index}>
                      <AlertTriangle size={16} />
                      {reason}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-reasons">
                  <CheckCircle2 size={18} />
                  No suspicious indicators were detected by the
                  current analysis rules.
                </p>
              )}
            </div>

            <div className="analysis-details">
              <span>Analysis method</span>
              <strong>{result.analysis_type}</strong>
            </div>

            <div className="result-disclaimer">
              <AlertTriangle size={17} />
              This result is a rule-based estimate, not a guarantee
              that the website is safe or malicious. Always verify
              unfamiliar websites independently.
            </div>
          </section>
        )}

        <section className="scanner-info-grid">

{mlResult && (
  <section className={`scan-result ${mlResult.prediction === "Phishing" ? "high" : "low"}`}>
    <div className="result-header">
      <div>
        <span className="result-eyebrow">
          MACHINE LEARNING ANALYSIS
        </span>
        <h2>AI Prediction Result</h2>
      </div>

      {mlResult.prediction === "Phishing" ? (
        <ShieldAlert size={32} />
      ) : (
        <ShieldCheck size={32} />
      )}
    </div>

    <div className="risk-overview">
      <div className="risk-level">
        <span>ML PREDICTION</span>
        <strong>{mlResult.prediction}</strong>
        <small>Random Forest classification</small>
      </div>

      <div className="risk-score">
        <span>MODEL CONFIDENCE</span>
        <strong>{mlResult.confidence}%</strong>
        <small>Prediction confidence, not safety probability</small>
      </div>
    </div>

    <div className="result-reasons">
      <h3>
        <Activity size={19} />
        Explainable AI Findings
      </h3>

      <ul>
        {mlResult.reasons.map((reason, index) => (
          <li key={index}>
            <AlertTriangle size={16} />
            {reason}
          </li>
        ))}
      </ul>
    </div>

    <div className="analysis-details">
      <span>Machine Learning Model</span>
      <strong>{mlResult.model}</strong>
    </div>

    <div className="result-disclaimer">
      <AlertTriangle size={17} />
      This is a demonstration model trained on a small sample dataset.
      Its prediction and confidence are not reliable proof of website safety.
    </div>
  </section>
)}

          <article>
            <ShieldCheck size={25} />
            <h3>Threat Awareness</h3>
            <p>Learn about suspicious website addresses.</p>
          </article>

          <article>
            <ShieldAlert size={25} />
            <h3>Phishing Protection</h3>
            <p>Identify potential phishing risk indicators.</p>
          </article>

          <article>
            <AlertTriangle size={25} />
            <h3>Stay Cautious</h3>
            <p>Never open unknown links just to test them.</p>
          </article>
        </section>

        <p className="scanner-disclaimer">
         Detection engines: Rule-based heuristic analysis and
experimental Random Forest machine-learning model.
        </p>
      </main>
    </div>
  );
}

export default URLScanner;
