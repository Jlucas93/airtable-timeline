import React, { useState, useRef, useEffect, useCallback } from "react";
import timelineItems from "./utils/timelineItems";
import TimelineControls from "./components/TimelineControls";
import TimelineHeader from "./components/TimelineHeader";
import TimelineItem from "./components/TimelineItem";

import assignLanes from "./utils/assignLanes";
import addDays from "./utils/addDays";
import generateDates from "./utils/generateDates";
import getColor from "./utils/getColor";
import daysSince from "./utils/daysSince";
import formatDate from "./utils/formatDate";

import "./styles/timeline.css";

export default function Timeline() {
  const [items, setItems] = useState(timelineItems);
  const [visibleRange, setVisibleRange] = useState({
    startDate: new Date("2021-01-14"),
    days: 14,
  });
  const [editingItem, setEditingItem] = useState(null);
  const [dragInfo, setDragInfo] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const timelineRef = useRef(null);

  const { dates: dateRange, months } = generateDates(
    visibleRange.startDate,
    visibleRange.days
  );

  const lanes = assignLanes(
    items.filter((item) => {
      const itemStart = new Date(item.start);
      const itemEnd = new Date(item.end);
      const visibleEnd = new Date(visibleRange.startDate);
      visibleEnd.setDate(visibleEnd.getDate() + visibleRange.days);
      return !(itemEnd < visibleRange.startDate || itemStart > visibleEnd);
    })
  );

  const navigateTimeline = (direction) => {
    const newStartDate = new Date(visibleRange.startDate);
    const daysToMove =
      direction === "forward" ? visibleRange.days : -visibleRange.days;
    newStartDate.setDate(newStartDate.getDate() + daysToMove);
    setVisibleRange({
      ...visibleRange,
      startDate: newStartDate,
    });
  };

  const handleZoom = (delta) => {
    const newDays = Math.max(
      7,
      Math.min(28, visibleRange.days + (delta > 0 ? -7 : 7))
    );
    setVisibleRange({
      ...visibleRange,
      days: newDays,
    });
  };

  const handleDragMove = useCallback(
    (e) => {
      setDragInfo((prev) => {
        if (!prev) return null;

        const deltaX = e.clientX - prev.startX;
        const timelineWidth = timelineRef.current.getBoundingClientRect().width;
        const dayWidthInPixels = timelineWidth / visibleRange.days;
        const sensitivity = 0.5;
        const daysDelta = Math.round(deltaX / (dayWidthInPixels * sensitivity));

        if (daysDelta === 0 && !prev.lastMove) return prev;
        if (prev.lastMove === daysDelta) return prev;

        setItems((currentItems) =>
          currentItems.map((item) => {
            if (item.id !== prev.item.id) return item;

            if (prev.type === "move") {
              return {
                ...item,
                start: addDays(prev.initialStart, daysDelta),
                end: addDays(prev.initialEnd, daysDelta),
              };
            } else if (prev.type === "start") {
              const newStart = addDays(prev.initialStart, daysDelta);
              if (new Date(newStart) > new Date(item.end)) return item;
              return {
                ...item,
                start: newStart,
              };
            } else if (prev.type === "end") {
              const newEnd = addDays(prev.initialEnd, daysDelta);
              if (new Date(newEnd) < new Date(item.start)) return item;
              return {
                ...item,
                end: newEnd,
              };
            }
            return item;
          })
        );

        return { ...prev, lastMove: daysDelta };
      });
    },
    [visibleRange.days]
  );

  const handleDragEnd = useCallback(
    (e) => {
      setDragInfo(null);
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
      setTimeout(() => {
        setIsDragging(false);
      }, 100);
    },
    [handleDragMove]
  );

  const handleDragStart = (e, item, type) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    setIsDragging(true);

    setDragInfo({
      item,
      startX,
      type,
      initialStart: item.start,
      initialEnd: item.end,
      lastMove: 0,
    });

    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);
  };

  const handleEditStart = (item) => {
    setEditingItem(item.id);
  };

  const handleEditSave = (id, newName) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, name: newName } : item))
    );
    setEditingItem(null);
  };

  const createNewEvent = (clickEvent) => {
    if (isDragging) return;

    if (
      clickEvent.target.className === "timeline-body" ||
      clickEvent.target.className === "timeline-lane"
    ) {
      const rect = timelineRef.current.getBoundingClientRect();
      const relativeX = (clickEvent.clientX - rect.left) / rect.width;
      const dayIndex = Math.floor(relativeX * visibleRange.days);

      if (dayIndex >= 0 && dayIndex < visibleRange.days) {
        const clickDate = new Date(visibleRange.startDate);
        clickDate.setDate(clickDate.getDate() + dayIndex);
        const formattedDate = formatDate(clickDate);
        const newId = Math.max(0, ...items.map((item) => item.id)) + 1;

        const newEvent = {
          id: newId,
          name: "New Event",
          start: formattedDate,
          end: formattedDate,
        };

        setItems([...items, newEvent]);
        setEditingItem(newId);
      }
    }
  };

  const calculateItemStyle = (item) => {
    const startOffset = daysSince(item.start, visibleRange.startDate);
    const duration = daysSince(item.end, new Date(item.start)) + 1;
    const leftPercent = (startOffset / visibleRange.days) * 100;
    const widthPercent = (duration / visibleRange.days) * 100;

    return {
      left: `${leftPercent}%`,
      width: `${widthPercent}%`,
      backgroundColor: getColor(item.id),
    };
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
    };
  }, [handleDragMove, handleDragEnd]);

  return (
    <div className="timeline-container">
      <TimelineControls
        visibleRange={visibleRange}
        onNavigate={navigateTimeline}
        onZoom={handleZoom}
      />

      <div className="timeline-wrapper">
        <div className="timeline" ref={timelineRef}>
          <TimelineHeader
            months={months}
            dateRange={dateRange}
            visibleRange={visibleRange}
          />

          <div className="timeline-body" onClick={createNewEvent}>
            {lanes.map((lane, laneIndex) => (
              <div className="timeline-lane" key={laneIndex}>
                {lane.map((item) => {
                  const startOffset = daysSince(
                    item.start,
                    visibleRange.startDate
                  );
                  if (startOffset >= visibleRange.days) return null;

                  return (
                    <TimelineItem
                      key={item.id}
                      item={item}
                      style={calculateItemStyle(item)}
                      isEditing={editingItem === item.id}
                      isDragging={dragInfo?.item?.id === item.id}
                      onDragStart={handleDragStart}
                      onEdit={handleEditStart}
                      onSaveEdit={handleEditSave}
                      isDraggingActive={isDragging}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
