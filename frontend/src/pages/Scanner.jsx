import { useState } from "react";

import api, { getApiErrorMessage } from "../api/api.js";
import QRUploader from "../components/QRUploader.jsx";
import RiskResultCard from "../components/RiskResultCard.jsx";

function Scanner() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeUrl = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!url.trim()) {
      setError("Please enter or upload a URL before analyzing.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/api/scan/analyze", { url: url.trim() });
      setResult(response.data);
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, "Unable to analyze this URL. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleDecoded = (decodedText) => {
    setUrl(decodedText);
    setError("");
  };

  return (
    <section className="page scanner-page">
      <div className="page-heading">
        <p className="eyebrow">Scanner</p>
        <h1>Analyze a QR-code link</h1>
        <p className="muted">
          Paste a URL or decode one from a QR image, then send it to the backend risk engine.
        </p>
      </div>

      <div className="scanner-grid">
        <div className="scanner-card">
          <form onSubmit={analyzeUrl}>
            <label>
              URL to analyze
              <input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
              />
            </label>

            {error && <div className="alert error">{error}</div>}

            <button className="primary-button full-width" type="submit" disabled={loading}>
              {loading ? "Analyzing..." : "Analyze URL"}
            </button>
          </form>

          <div className="scanner-hints">
            <span>Checks HTTPS</span>
            <span>Detects shorteners</span>
            <span>Flags brand impersonation</span>
          </div>

          <QRUploader onDecoded={handleDecoded} />
        </div>

        {result ? (
          <RiskResultCard result={result} />
        ) : (
          <aside className="result-placeholder">
            <p className="eyebrow">Waiting for analysis</p>
            <h2>No scan result yet</h2>
            <p className="muted">
              Enter a complete URL or upload a QR image. The risk result will appear here after analysis.
            </p>
          </aside>
        )}
      </div>
    </section>
  );
}

export default Scanner;
