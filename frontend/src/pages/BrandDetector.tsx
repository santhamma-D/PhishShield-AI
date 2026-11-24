
import { useState } from "react";
import { ShieldCheck, ShieldAlert, Search, Globe } from "lucide-react";
import "./BrandDetector.css";

const API_URL = "http://127.0.0.1:8000";

interface ScanResult {
  success: boolean;
  brand?: string;
  status?: string;
  risk?: string;
  score?: number;
  message?: string;
}

export default function BrandDetector() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);

  const scanBrand = async () => {
    if (!url.trim()) {
      alert("Please enter a website URL.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/scan-brand`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Brand scan failed.");
      }

      setResult(data);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="brand-page">
      <div className="brand-header">
        <div className="brand-icon"><ShieldCheck size={28} /></div>
        <div>
          <h1>Brand Impersonation Detector</h1>
          <p>Identify websites that imitate trusted brands.</p>
        </div>
      </div>

      <section className="brand-card">
        <h2><Globe size={20} /> Analyze a Website</h2>
        <p>Enter a website address to check for suspicious brand similarities.</p>

        <div className="brand-input">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && scanBrand()}
            placeholder="https://example.com"
          />
          <button onClick={scanBrand} disabled={loading}>
            <Search size={17} />
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {result && (
          <div className={`brand-result ${result.risk?.toLowerCase()}`}>
            <div className="brand-result-heading">
              {result.risk === "High"
                ? <ShieldAlert size={24} />
                : <ShieldCheck size={24} />}
              <h3>{result.status || "Scan Result"}</h3>
            </div>

            <p><strong>Brand:</strong> {result.brand || "Unknown"}</p>
            <p><strong>Risk:</strong> {result.risk || "Unknown"}</p>
            <p><strong>Risk Score:</strong> {result.score ?? "N/A"}/100</p>
            <p>{result.message}</p>
          </div>
        )}
      </section>

      <p className="brand-note">
        Detection is based on domain similarity rules. A low-risk result does not guarantee that a website is safe.
      </p>
    </main>
  );
}
