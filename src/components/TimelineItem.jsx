import React, { useRef } from "react";

export default function TimelineItem({
  item,
  style,
  isEditing,
  isDragging,
  onDragStart,
  onEdit,
  onSaveEdit,
  isDraggingActive,
}) {
  const mouseMovedRef = useRef(false);

  const mouseDownPosRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e, type) => {
    mouseMovedRef.current = false;

    mouseDownPosRef.current = { x: e.clientX, y: e.clientY };

    const handleTempMouseMove = (moveEvent) => {
      const deltaX = Math.abs(moveEvent.clientX - mouseDownPosRef.current.x);
      const deltaY = Math.abs(moveEvent.clientY - mouseDownPosRef.current.y);

      if (deltaX > 3 || deltaY > 3) {
        mouseMovedRef.current = true;

        onDragStart(e, item, type);
        document.removeEventListener("mousemove", handleTempMouseMove);
        document.removeEventListener("mouseup", handleTempMouseUp);
      }
    };

    const handleTempMouseUp = () => {
      document.removeEventListener("mousemove", handleTempMouseMove);
      document.removeEventListener("mouseup", handleTempMouseUp);

      if (!mouseMovedRef.current && type === "move") {
        onEdit(item);
      }
    };

    document.addEventListener("mousemove", handleTempMouseMove);
    document.addEventListener("mouseup", handleTempMouseUp);

    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className={`timeline-item ${isDragging ? "dragging" : ""}`}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div
        className="resize-handle start-handle"
        onMouseDown={(e) => onDragStart(e, item, "start")}
      />

      <div
        className="item-content"
        onMouseDown={(e) => handleMouseDown(e, "move")}
        onDoubleClick={(e) => {
          e.stopPropagation();
          if (!isDraggingActive) {
            onEdit(item);
          }
        }}
      >
        {isEditing ? (
          <input
            type="text"
            defaultValue={item.name}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSaveEdit(item.id, e.target.value);
              } else if (e.key === "Escape") {
                onSaveEdit(item.id, item.name);
              }
            }}
            onBlur={(e) => onSaveEdit(item.id, e.target.value)}
            autoFocus
          />
        ) : (
          <div className="item-label">{item.name}</div>
        )}

        <div className="item-dates">
          {new Date(item.start).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}{" "}
          –
          {new Date(item.end).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>

      <div
        className="resize-handle end-handle"
        onMouseDown={(e) => onDragStart(e, item, "end")}
      />
    </div>
  );
}
