const riskClassMap = {
  "Low Risk": "risk-low",
  "Medium Risk": "risk-medium",
  "High Risk": "risk-high"
};

function RiskResultCard({ result }) {
  if (!result) {
    return null;
  }

  const riskClass = riskClassMap[result.level] || "risk-medium";

  return (
    <section className={`result-card ${riskClass}`}>
      <div className="result-header">
        <div>
          <p className="eyebrow">Analysis result</p>
          <h2>{result.level}</h2>
        </div>
        <div className="score-ring">
          <span>{result.score}</span>
          <small>/100</small>
        </div>
      </div>

      <div className="risk-meter" aria-label={`Risk score ${result.score} out of 100`}>
        <span style={{ width: `${result.score}%` }} />
      </div>

      <div className="result-url">
        <span>Analyzed URL</span>
        <p>{result.url}</p>
      </div>

      <div className="result-section">
        <h3>Detected issues</h3>
        <ul>
          {result.issues.map((issue, index) => (
            <li key={`${issue}-${index}`}>{issue}</li>
          ))}
        </ul>
      </div>

      <div className="recommendation">
        <h3>Recommendation</h3>
        <p>{result.recommendation}</p>
      </div>
    </section>
  );
}

export default RiskResultCard;
