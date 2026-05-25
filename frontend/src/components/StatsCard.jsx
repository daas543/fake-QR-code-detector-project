function StatsCard({ label, value, tone = "neutral", caption }) {
  return (
    <article className={`stats-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      {caption && <small>{caption}</small>}
    </article>
  );
}

export default StatsCard;
