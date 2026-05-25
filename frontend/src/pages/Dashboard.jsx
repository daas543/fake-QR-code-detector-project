import { useEffect, useState } from "react";

import api, { getApiErrorMessage } from "../api/api.js";
import StatsCard from "../components/StatsCard.jsx";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await api.get("/api/dashboard/stats");
        setStats(response.data);
      } catch (apiError) {
        setError(getApiErrorMessage(apiError, "Unable to load dashboard statistics."));
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const latestScan = stats?.recentScans?.[0];

  return (
    <section className="page dashboard-page">
      <div className="page-heading">
        <p className="eyebrow">Dashboard</p>
        <h1>Risk overview</h1>
        <p className="muted">Track how many QR links you have analyzed and how risky they were.</p>
      </div>

      {loading && <div className="alert">Loading dashboard...</div>}
      {error && <div className="alert error">{error}</div>}

      {stats && (
        <>
          <div className="stats-grid">
            <StatsCard label="Total scans" value={stats.totalScans} caption="All saved analyses" />
            <StatsCard label="Low risk" value={stats.lowRiskScans} tone="low" caption="Score 0-30" />
            <StatsCard label="Medium risk" value={stats.mediumRiskScans} tone="medium" caption="Score 31-60" />
            <StatsCard label="High risk" value={stats.highRiskScans} tone="high" caption="Score 61-100" />
            <StatsCard label="Average score" value={stats.averageScore} caption="Rounded risk score" />
          </div>

          <section className={`latest-card ${latestScan?.level?.toLowerCase().replaceAll(" ", "-") || ""}`}>
            <p className="eyebrow">Latest scanned URL</p>
            {latestScan ? (
              <>
                <h2>{latestScan.level}</h2>
                <p className="latest-url">{latestScan.url}</p>
                <div className="latest-meta">
                  <span>Score: {latestScan.score}/100</span>
                  <span>{new Date(latestScan.createdAt).toLocaleString()}</span>
                </div>
              </>
            ) : (
              <p className="muted">No scans yet. Analyze your first QR link from the scanner.</p>
            )}
          </section>
        </>
      )}
    </section>
  );
}

export default Dashboard;
