import React, { useEffect, useState } from "react";
import "../../assets/styles/CurrentDateTime.css";

const CurrentDateTime = ({ className = "" }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const dateText = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(currentTime);

  const timeText = new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(currentTime);

  return (
    <div className={`current-date-time ${className}`}>
      <div className="current-date-time-label">Hôm nay</div>

      <div className="current-date-time-content">
        <span className="current-date-time-date">{dateText}</span>

        <span className="current-date-time-separator">·</span>

        <span className="current-date-time-clock">{timeText}</span>
      </div>
    </div>
  );
};

export default CurrentDateTime;
