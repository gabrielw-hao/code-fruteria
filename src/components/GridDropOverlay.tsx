import React from 'react';
import { COLORS } from '../constants/colors';

interface GridDropOverlayProps {
  rows: number;
  cols: number;
  activeCell: { row: number; col: number } | null;
  visible: boolean;
  top?: number; // navbar height offset
}

export const GridDropOverlay: React.FC<GridDropOverlayProps> = ({
  rows,
  cols,
  activeCell,
  visible,
  top = 0,
}) => {
  // Prevent grid overlay from showing if a mouse event is triggered by a click (like closing a panel)
  // Only show overlay for drag events (pointerEvents: 'none' disables overlay for clicks)
  return visible ? (
    <div
      style={{
        position: 'absolute',
        top,
        left: 0,
        right: 0,
        height: `calc(100% - ${top}px)`,
        pointerEvents: 'none',
        display: 'grid',
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        zIndex: 2000,
        background: COLORS.gridDropOverlayBg,
        opacity: 1,
        transition: 'background 0.1s, opacity 0.1s',
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
              border: `2.5px dashed ${COLORS.gridDropOverlayBorder}`,
              background: isActive
                ? COLORS.gridDropOverlayActive
                : COLORS.gridDropOverlayInactive,
              transition: 'background 0.1s, border 0.1s',
              borderRadius: isActive ? 8 : 0,
              boxShadow: isActive
                ? `0 0 0 2px ${COLORS.gridDropOverlayBoxShadow}`
                : undefined,
              pointerEvents: 'none',
            }}
          />
        );
      })}
    </div>
  ) : null;
};
