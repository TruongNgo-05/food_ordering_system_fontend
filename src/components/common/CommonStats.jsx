import React from "react";

const CommonStats = ({ stats = [] }) => {
  if (!Array.isArray(stats) || stats.length === 0) return null;

  return (
    <div className="admin-grid">
      {stats.map((stat) => (
        <article key={stat.label} className="admin-stat">
          <p className="admin-stat-label">{stat.label}</p>
          <p className="admin-stat-value">{stat.value}</p>
        </article>
      ))}
    </div>
  );
};

export default CommonStats;
