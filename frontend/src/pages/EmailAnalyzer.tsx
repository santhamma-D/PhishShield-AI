
import { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Mail,
  Search,
  AlertTriangle,
  CheckCircle2,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./EmailAnalyzer.css";
import API_BASE_URL from "../api";

interface EmailResult {
  success: boolean;
  risk_score: number;
  risk_level: string;
  reasons: string[];
  extracted_urls: string[];
  suspicious_urls: string[];
  analysis_type: string;
}

function EmailAnalyzer() {
  const [emailText, setEmailText] = useState("");
  const [result, setResult] = useState<EmailResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeEmail = async () => {
    if (!emailText.trim()) {
      setError("Please enter the email content before analyzing.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/scan-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email_text: emailText.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Email analysis failed.");
      }

      setResult(data as EmailResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the email analysis server."
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
    <main className="email-analyzer-page">
      <nav className="email-nav">
        <Link to="/dashboard" className="email-back-link">
          ← Back to Dashboard
        </Link>
        <span className="email-brand">
          <ShieldCheck size={22} />
          PHISHSHIELD AI
        </span>
      </nav>

      <section className="email-hero">
        <div className="email-icon">
          <Mail size={30} />
        </div>

        <span className="email-eyebrow">EMAIL SECURITY ANALYSIS</span>

        <h1>Email Phishing Analyzer</h1>

        <p>
          Analyze suspicious emails and identify phishing indicators
          before responding or clicking any links.
        </p>
      </section>

      <section className="email-input-card">
        <div className="email-section-heading">
          <div>
            <h2>Analyze an email</h2>
            <p>Paste the email message you want to inspect.</p>
          </div>
          <Mail size={25} />
        </div>

        <label htmlFor="email-content">Email content</label>

        <textarea
          id="email-content"
          value={emailText}
          onChange={(event) => setEmailText(event.target.value)}
          placeholder="Paste the complete email message here..."
          rows={9}
          maxLength={20000}
        />

        <div className="email-input-footer">
          <span>{emailText.length}/20,000 characters</span>
          <span>Do not enter passwords or private information.</span>
        </div>

        {error && (
          <div className="email-error">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        <button
          className="email-analyze-button"
          onClick={analyzeEmail}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={19} className="email-spinner" />
              Analyzing Email...
            </>
          ) : (
            <>
              <Search size={19} />
              Analyze Email
            </>
          )}
        </button>
      </section>

      {result && (
        <section className="email-result-card">
          <div className="email-result-heading">
            <div>
              <span className="email-eyebrow">ANALYSIS REPORT</span>
              <h2>Email Security Results</h2>
            </div>
            {result.risk_level.toLowerCase() === "high" ? (
              <ShieldAlert size={30} />
            ) : (
              <ShieldCheck size={30} />
            )}
          </div>

          <div className={`email-risk-panel ${getRiskClass(result.risk_level)}`}>
            <div>
              <span>Risk level</span>
              <h3>{result.risk_level} Risk</h3>
            </div>
            <div className="email-score">
              <strong>{result.risk_score}</strong>
              <span>/100</span>
            </div>
          </div>

          <div className="email-result-section">
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
              <p>
                No suspicious indicators were identified by the current
                detection rules.
              </p>
            )}
          </div>

          <div className="email-result-section">
            <h3>
              <LinkIcon size={19} />
              Extracted links ({result.extracted_urls.length})
            </h3>

            {result.extracted_urls.length > 0 ? (
              <ul className="email-url-list">
                {result.extracted_urls.map((url, index) => (
                  <li key={index}>{url}</li>
                ))}
              </ul>
            ) : (
              <p>No links were found in this email.</p>
            )}
          </div>

          <div className="email-result-section">
            <h3>
              <AlertTriangle size={19} />
              Suspicious links ({result.suspicious_urls.length})
            </h3>

            {result.suspicious_urls.length > 0 ? (
              <ul className="email-url-list suspicious">
                {result.suspicious_urls.map((url, index) => (
                  <li key={index}>{url}</li>
                ))}
              </ul>
            ) : (
              <p>No suspicious links were identified by the current rules.</p>
            )}
          </div>

          <div className="email-analysis-type">
            <CheckCircle2 size={17} />
            Detection engine: {result.analysis_type}
          </div>

          <p className="email-disclaimer">
            This result is based on detection rules and is not a guarantee
            that an email is safe or malicious. Always verify suspicious
            messages independently.
          </p>
        </section>
      )}
    </main>
  );
}

export default EmailAnalyzer;
