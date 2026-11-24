
import { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  MessageSquare,
  Search,
  AlertTriangle,
  CheckCircle2,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./SMSDetector.css";
import API_BASE_URL from "../api";

interface SMSResult {
  success: boolean;
  risk_score: number;
  risk_level: string;
  reasons: string[];
  extracted_urls: string[];
  suspicious_urls: string[];
  analysis_type: string;
}

function SMSDetector() {
  const [smsText, setSmsText] = useState("");
  const [result, setResult] = useState<SMSResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeSMS = async () => {
    if (!smsText.trim()) {
      setError("Please enter an SMS message before analyzing.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
       `${API_BASE_URL}/api/scan-sms`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sms_text: smsText.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "SMS analysis failed.");
      }

      setResult(data as SMSResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the SMS analysis server."
      );
    } finally {
      setLoading(false);
    }
  };

  const getRiskClass = (level: string) => {
    const normalized = level.toLowerCase();

    if (normalized === "high") return "high";
    if (normalized === "medium") return "medium";
    return "low";
  };

  return (
    <main className="sms-detector-page">
      <nav className="sms-nav">
        <Link to="/dashboard" className="sms-back-link">
          ← Back to Dashboard
        </Link>

        <span className="sms-brand">
          <ShieldCheck size={22} />
          PHISHSHIELD AI
        </span>
      </nav>

      <section className="sms-hero">
        <div className="sms-icon">
          <MessageSquare size={30} />
        </div>

        <span className="sms-eyebrow">SMS SECURITY ANALYSIS</span>

        <h1>SMS Scam Detector</h1>

        <p>
          Identify suspicious text messages, scam links,
          fraudulent offers and attempts to steal sensitive information.
        </p>
      </section>

      <section className="sms-input-card">
        <div className="sms-section-heading">
          <div>
            <h2>Analyze an SMS</h2>
            <p>Paste the message you want to inspect.</p>
          </div>

          <MessageSquare size={25} />
        </div>

        <label htmlFor="sms-content">SMS message content</label>

        <textarea
          id="sms-content"
          value={smsText}
          onChange={(event) => setSmsText(event.target.value)}
          placeholder="Paste your suspicious SMS message here..."
          rows={8}
          maxLength={10000}
        />

        <div className="sms-input-footer">
          <span>{smsText.length}/10,000 characters</span>
          <span>Do not enter passwords or private information.</span>
        </div>

        {error && (
          <div className="sms-error">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        <button
          className="sms-analyze-button"
          onClick={analyzeSMS}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={19} className="sms-spinner" />
              Analyzing SMS...
            </>
          ) : (
            <>
              <Search size={19} />
              Analyze SMS
            </>
          )}
        </button>
      </section>

      {result && (
        <section className="sms-result-card">
          <div className="sms-result-heading">
            <div>
              <span className="sms-eyebrow">ANALYSIS REPORT</span>
              <h2>SMS Security Results</h2>
            </div>

            {result.risk_level.toLowerCase() === "high" ? (
              <ShieldAlert size={30} />
            ) : (
              <ShieldCheck size={30} />
            )}
          </div>

          <div className={`sms-risk-panel ${getRiskClass(result.risk_level)}`}>
            <div>
              <span>Risk level</span>
              <h3>{result.risk_level} Risk</h3>
            </div>

            <div className="sms-score">
              <strong>{result.risk_score}</strong>
              <span>/100</span>
            </div>
          </div>

          <div className="sms-result-section">
            <h3>
              <AlertTriangle size={19} />
              Detection findings
            </h3>

            {result.reasons.length > 0 ? (
              <ul>
                {result.reasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            ) : (
              <p>No suspicious indicators were identified.</p>
            )}
          </div>

          <div className="sms-result-section">
            <h3>
              <LinkIcon size={19} />
              Extracted links ({result.extracted_urls.length})
            </h3>

            {result.extracted_urls.length > 0 ? (
              <ul className="sms-url-list">
                {result.extracted_urls.map((url, index) => (
                  <li key={index}>{url}</li>
                ))}
              </ul>
            ) : (
              <p>No links were found in this message.</p>
            )}
          </div>

          <div className="sms-result-section">
            <h3>
              <AlertTriangle size={19} />
              Suspicious links ({result.suspicious_urls.length})
            </h3>

            {result.suspicious_urls.length > 0 ? (
              <ul className="sms-url-list suspicious">
                {result.suspicious_urls.map((url, index) => (
                  <li key={index}>{url}</li>
                ))}
              </ul>
            ) : (
              <p>No suspicious links were identified by the current rules.</p>
            )}
          </div>

          <div className="sms-analysis-type">
            <CheckCircle2 size={17} />
            Detection engine: {result.analysis_type}
          </div>

          <p className="sms-disclaimer">
            This result is based on detection rules and is not a guarantee
            that a message is safe or malicious. Verify suspicious messages
            independently.
          </p>
        </section>
      )}
    </main>
  );
}

export default SMSDetector;
