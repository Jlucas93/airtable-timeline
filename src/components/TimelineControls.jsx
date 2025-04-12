import React from "react";

export default function TimelineControls({ visibleRange, onNavigate, onZoom }) {
  return (
    <div className="timeline-controls">
      <button onClick={() => onNavigate("backward")}>← Previous</button>
      <div className="zoom-controls">
        <button onClick={() => onZoom(1)}>–</button>
        <span>{visibleRange.days} days</span>
        <button onClick={() => onZoom(-1)}>+</button>
      </div>
      <button onClick={() => onNavigate("forward")}>Next →</button>
    </div>
  );
}
