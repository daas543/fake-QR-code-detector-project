import { useEffect, useState } from "react";

import api, { getApiErrorMessage } from "../api/api.js";

function History() {
  const [scans, setScans] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await api.get("/api/scan/history");
        setScans(response.data.scans || []);
      } catch (apiError) {
        setError(getApiErrorMessage(apiError, "Unable to load scan history."));
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  return (
    <section className="page history-page">
      <div className="page-heading">
        <p className="eyebrow">History</p>
        <h1>Scan history</h1>
        <p className="muted">Review previous QR and URL risk checks saved to your account.</p>
      </div>

      {loading && <div className="alert">Loading scan history...</div>}
      {error && <div className="alert error">{error}</div>}

      {!loading && !error && scans.length === 0 && (
        <div className="empty-state">No scans have been saved yet.</div>
      )}

      {scans.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>URL</th>
                <th>Score</th>
                <th>Risk level</th>
                <th>Issues</th>
                <th>Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {scans.map((scan) => (
                <tr key={scan.id}>
                  <td>{new Date(scan.createdAt).toLocaleString()}</td>
                  <td className="url-cell">{scan.url}</td>
                  <td>
                    <strong>{scan.score}</strong>
                    <span className="score-suffix">/100</span>
                  </td>
                  <td>
                    <span className={`risk-pill ${scan.level.toLowerCase().replaceAll(" ", "-")}`}>
                      {scan.level}
                    </span>
                  </td>
                  <td>
                    <ul className="compact-list">
                      {scan.issues.map((issue, index) => (
                        <li key={`${scan.id}-${index}`}>{issue}</li>
                      ))}
                    </ul>
                  </td>
                  <td>{scan.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default History;
