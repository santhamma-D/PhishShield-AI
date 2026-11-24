
import { useEffect, useState } from "react";
import {
  History,
  RefreshCw,
  ShieldCheck,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./ScanHistory.css";
import API_BASE_URL from "../api";
interface ScanRecord {
  id: number;
  scan_type: string;
  input_value: string;
  risk_level: string | null;
  result: string;
  scanned_at: string;
}

function ScanHistory() {
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHistory = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/scan-history`
      );

      if (!response.ok) {
        throw new Error("Unable to load scan history.");
      }

      const data = await response.json();
      setHistory(data.history || []);
    } catch {
      setError("Unable to connect to the scan history service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="history-page">
      <header className="history-header">
        <Link to="/dashboard" className="history-back">
          <ArrowLeft size={18} />
          Dashboard
        </Link>

        <div className="history-brand">
          <ShieldCheck size={25} />
          PHISHSHIELD AI
        </div>
      </header>

      <main className="history-container">
        <section className="history-heading">
          <div>
            <span className="history-eyebrow">
              SECURITY ACTIVITY
            </span>
            <h1>Scan History</h1>
            <p>Review your previous security scans.</p>
          </div>

          <button
            className="history-refresh"
            onClick={loadHistory}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </section>

        <section className="history-summary">
          <div className="history-stat">
            <History size={22} />
            <span>Total Scans</span>
            <strong>{history.length}</strong>
          </div>
        </section>

        {loading ? (
          <div className="history-empty">
            Loading scan history...
          </div>
        ) : error ? (
          <div className="history-empty">
            {error}
          </div>
        ) : history.length === 0 ? (
          <div className="history-empty">
            <History size={38} />
            <h3>No scan history yet</h3>
            <p>Your completed scans will appear here.</p>
          </div>
        ) : (
          <section className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Scan Type</th>
                  <th>Scanned Input</th>
                  <th>Risk Level</th>
                  <th>Date & Time</th>
                </tr>
              </thead>

              <tbody>
                {history.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <span className="history-type">
                        {record.scan_type}
                      </span>
                    </td>

                    <td className="history-input">
                      {record.input_value}
                    </td>

                    <td>
                      <span
                        className={`history-risk ${(
                          record.risk_level || "Unknown"
                        ).toLowerCase()}`}
                      >
                        {record.risk_level || "Unknown"}
                      </span>
                    </td>

                    <td>
                      <Clock size={14} />
                      {record.scanned_at}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </div>
  );
}

export default ScanHistory;
