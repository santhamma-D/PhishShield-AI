
import { useRef, useState } from "react";
import jsQR from "jsqr";
import {
  QrCode,
  Upload,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Link as LinkIcon,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./QRScanner.css";
import API_BASE_URL from "../api";

interface QRResult {
  success: boolean;
  qr_content?: string;
  extracted_url?: string | null;
  hostname?: string | null;
  risk_score?: number;
  risk_level?: string;
  reasons?: string[];
  analysis_type?: string;
  message?: string;
}

function QRScanner() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [, setQrContent] = useState("");
  const [result, setResult] = useState<QRResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file?: File) => {
    if (!file) return;

    setResult(null);
    setQrContent("");
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be 5 MB or less.");
      return;
    }

    setSelectedFile(file);
  };

  const analyzeQR = async () => {
    if (!selectedFile) {
      setError("Please upload a QR code image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setQrContent("");

    try {
      const imageUrl = URL.createObjectURL(selectedFile);

      try {
        const image = new Image();
        image.src = imageUrl;

        await new Promise<void>((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = () => reject(new Error("Unable to read the uploaded image."));
        });

        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Unable to process the uploaded image.");
        }

        context.drawImage(image, 0, 0);

        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );

        const decoded = jsQR(
          imageData.data,
          imageData.width,
          imageData.height
        );

        if (!decoded) {
          throw new Error("No readable QR code was found. Try a clearer image.");
        }

        setQrContent(decoded.data);

        const response = await fetch(`${API_BASE_URL}/api/scan-qr`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            qr_content: decoded.data,
          }),
        });

        const data: QRResult = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "QR analysis failed.");
        }

        setResult(data);
      } finally {
        URL.revokeObjectURL(imageUrl);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const riskColor =
    result?.risk_level === "High"
      ? "high"
      : result?.risk_level === "Medium"
      ? "medium"
      : "low";

  return (
    <main className="qr-page">
      <header className="qr-topbar">
        <Link to="/dashboard" className="qr-back-link">
          ← Back to Dashboard
        </Link>
        <span className="qr-brand">
          <QrCode size={21} /> PhishShield AI
        </span>
      </header>

      <section className="qr-hero">
        <span className="qr-eyebrow">QR CODE SECURITY</span>
        <h1>QR Code Security Scanner</h1>
        <p>
          Upload a QR code image to extract its content and identify
          potentially suspicious website links.
        </p>
      </section>

      <section className="qr-layout">
        <div className="qr-upload-card">
          <div className="qr-card-heading">
            <Upload size={22} />
            <h2>Upload QR Code</h2>
          </div>

          <button
            type="button"
            className="qr-dropzone"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="qr-upload-icon">
              <QrCode size={38} />
            </span>
            <strong>
              {selectedFile ? selectedFile.name : "Choose a QR code image"}
            </strong>
            <span>Click to browse PNG, JPG or other image files</span>
            <span className="qr-file-limit">Maximum file size: 5 MB</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => handleFileChange(event.target.files?.[0])}
          />

          {selectedFile && (
            <div className="qr-selected-file">
              <CheckCircle2 size={17} />
              Image selected successfully
            </div>
          )}

          <button
            type="button"
            className="qr-analyze-button"
            onClick={analyzeQR}
            disabled={loading || !selectedFile}
          >
            {loading ? (
              <>
                <Loader2 className="qr-spinner" size={18} />
                Analyzing QR Code...
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                Analyze QR Code
              </>
            )}
          </button>

          {error && (
            <div className="qr-error">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}

          <p className="qr-safety-note">
            <ShieldCheck size={16} />
            Never open suspicious links just to test them.
          </p>
        </div>

        <div className="qr-result-card">
          <div className="qr-card-heading">
            <ShieldAlert size={22} />
            <h2>Security Analysis</h2>
          </div>

          {!result && !loading && (
            <div className="qr-empty-state">
              <QrCode size={48} />
              <h3>Ready to Scan</h3>
              <p>
                Upload a QR code image and select Analyze QR Code to
                see its security report.
              </p>
            </div>
          )}

          {loading && (
            <div className="qr-empty-state">
              <Loader2 className="qr-spinner" size={42} />
              <h3>Analyzing your QR code</h3>
              <p>Reading the image and checking its content...</p>
            </div>
          )}

          {result && (
            <div className="qr-results">
              <div className={`qr-risk-panel ${riskColor}`}>
                <span>Risk Score</span>
                <strong>{result.risk_score}/100</strong>
                <span>{result.risk_level} Risk</span>
              </div>

              <div className="qr-result-detail">
                <span>Extracted Content</span>
                <p>{result.qr_content}</p>
              </div>

              {result.extracted_url && (
                <div className="qr-result-detail">
                  <span>
                    <LinkIcon size={15} /> Website
                  </span>
                  <p>{result.extracted_url}</p>
                </div>
              )}

              {result.hostname && (
                <div className="qr-result-detail">
                  <span>Domain</span>
                  <p>{result.hostname}</p>
                </div>
              )}

              <div className="qr-reasons">
                <h3>Security Findings</h3>
                {result.reasons && result.reasons.length > 0 ? (
                  result.reasons.map((reason, index) => (
                    <div className="qr-reason" key={index}>
                      <AlertTriangle size={16} />
                      <span>{reason}</span>
                    </div>
                  ))
                ) : (
                  <p>No suspicious indicators were detected by the current rules.</p>
                )}
              </div>

              <p className="qr-engine">
                Detection engine: {result.analysis_type}
              </p>
              <p className="qr-disclaimer">
                A low-risk result does not guarantee that a QR code or
                website is safe.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default QRScanner;
