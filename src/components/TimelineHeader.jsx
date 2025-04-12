import React from "react";

export default function TimelineHeader({ months, dateRange, visibleRange }) {
  return (
    <>
      <div className="timeline-month-header">
        {months.map((month) => (
          <div
            key={month.key}
            className="timeline-month"
            style={{
              width: `${(month.count / visibleRange.days) * 100}%`,
              left: `${(month.startIndex / visibleRange.days) * 100}%`,
            }}
          >
            <div className="month-name">
              {month.month} {month.year}
            </div>
          </div>
        ))}
      </div>

      <div className="timeline-header">
        {dateRange.map((dateObj, index) => (
          <div
            className={`timeline-day ${dateObj.isWeekend ? "weekend" : ""}`}
            key={index}
          >
            <div className="day-name">{dateObj.dayName}</div>
            <div className="day-number">{dateObj.dayNumber}</div>
          </div>
        ))}
      </div>
    </>
  );
}
