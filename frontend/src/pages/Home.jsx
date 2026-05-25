import { Link } from "react-router-dom";

function Home() {
  const token = localStorage.getItem("token");

  return (
    <section className="home-page">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">QR-code phishing protection</p>
          <h1>Fake QR Code Detector</h1>
          <p className="subtitle">Scan before you trust</p>
          <p className="hero-text">
            Quishing is QR-code phishing: attackers hide malicious links inside QR codes to steal
            passwords, payment details, or account access. This app checks suspicious QR links before
            you open them.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to={token ? "/scanner" : "/login"}>
              {token ? "Open scanner" : "Start scanning"}
            </Link>
            {!token && (
              <Link className="secondary-link" to="/register">
                Create account
              </Link>
            )}
          </div>
          <div className="trust-strip" aria-label="Application capabilities">
            <span>Local QR decoding</span>
            <span>JWT protected history</span>
            <span>Rule-based risk score</span>
          </div>
        </div>

        <div className="threat-panel" aria-label="Cybersecurity signal panel">
          <div className="panel-status">
            <span className="pulse-dot" />
            Risk engine online
          </div>
          <div className="scan-frame">
            <div className="qr-grid">
              {Array.from({ length: 36 }).map((_, index) => (
                <span key={index} className={index % 3 === 0 || index % 7 === 0 ? "filled" : ""} />
              ))}
            </div>
            <div className="scan-line" />
          </div>
          <div className="signal-list">
            <span>HTTPS check</span>
            <span>Shortener detection</span>
            <span>Brand impersonation signals</span>
            <span>Risk score: 0-100</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
