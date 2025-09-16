import React from 'react';

interface GridDropOverlayProps {
  rows: number;
  cols: number;
  activeCell: { row: number; col: number } | null;
  visible: boolean;
}

export const GridDropOverlay: React.FC<GridDropOverlayProps> = ({
  rows,
  cols,
  activeCell,
  visible,
}) => {
  // Prevent grid overlay from showing if a mouse event is triggered by a click (like closing a panel)
  // Only show overlay for drag events (pointerEvents: 'none' disables overlay for clicks)
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: visible ? 'none' : 'none', // Always "none" to avoid interfering with clicks
        display: 'grid',
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        zIndex: 10,
        background: visible ? 'rgba(30,40,80,0.18)' : 'transparent',
        opacity: visible ? 1 : 0,
        transition: 'background 0.1s, opacity 0.1s',
        // Optionally, add userSelect: 'none' to avoid accidental text selection
        userSelect: 'none',
      }}
    >
      {[...Array(rows * cols)].map((_, idx) => {
        const row = Math.floor(idx / cols);
        const col = idx % cols;
        const isActive =
          activeCell && activeCell.row === row && activeCell.col === col;
        return (
          <div
            key={idx}
            style={{
              border: '2.5px dashed #7ec7ff',
              background: isActive
                ? 'rgba(126,199,255,0.32)'
                : 'rgba(255,255,255,0.07)',
              transition: 'background 0.1s, border 0.1s',
              borderRadius: isActive ? 8 : 0,
              boxShadow: isActive ? '0 0 0 2px #7ec7ff88' : undefined,
              pointerEvents: 'none', // Prevent grid cell from capturing pointer events
            }}
          />
        );
      })}
    </div>
  );
};
