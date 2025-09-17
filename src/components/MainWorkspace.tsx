import React, { useState, useRef, useEffect } from 'react';
import { GridDropOverlay } from './GridDropOverlay';

interface MainWorkspaceProps {
  children: React.ReactNode;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onGridDropInfo?: (info: {
    cell: { row: number; col: number } | null;
    size: { width: number; height: number };
  }) => void;
  gridRows?: number;
  gridCols?: number;
}

export const MainWorkspace: React.FC<MainWorkspaceProps> = ({
  children,
  onDrop,
  onDragOver,
  onGridDropInfo,
  gridRows = 2,
  gridCols = 2,
}) => {
  const [dragging, setDragging] = useState(false);
  const [activeCell, setActiveCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const dragInProgress = useRef(false);
  const workspaceRef = useRef<HTMLDivElement>(null);

  // Update container size on mount and resize
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const updateSize = () => {
      if (workspaceRef.current) {
        setContainerSize({
          width: workspaceRef.current.offsetWidth,
          height: workspaceRef.current.offsetHeight,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Only show overlay when dragging from nav (not when dragging panels inside)
  useEffect(() => {
    // Listen for nav drag start (native drag)
    const handleNavDragStart = () => {
      dragInProgress.current = true;
      setDragging(true);
    };
    const handleNavDragEnd = () => {
      dragInProgress.current = false;
      setDragging(false);
      setActiveCell(null);
      if (onGridDropInfo) onGridDropInfo({ cell: null, size: containerSize });
    };
    window.addEventListener('nav-drag-start', handleNavDragStart);
    window.addEventListener('nav-drag-end', handleNavDragEnd);

    // Listen for panel drag events (custom event)
    const handlePanelDragStart = () => {
      dragInProgress.current = true;
      setDragging(true);
    };
    const handlePanelDragEnd = () => {
      dragInProgress.current = false;
      setDragging(false);
      setActiveCell(null);
      if (onGridDropInfo) onGridDropInfo({ cell: null, size: containerSize });
    };
    window.addEventListener('panel-drag-start', handlePanelDragStart as any);
    window.addEventListener('panel-drag-end', handlePanelDragEnd as any);
    // Listen for ESC key to cancel drag
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dragInProgress.current = false;
        setDragging(false);
        setActiveCell(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('nav-drag-start', handleNavDragStart);
      window.removeEventListener('nav-drag-end', handleNavDragEnd);
      window.removeEventListener(
        'panel-drag-start',
        handlePanelDragStart as any
      );
      window.removeEventListener('panel-drag-end', handlePanelDragEnd as any);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [containerSize, onGridDropInfo]);

  const handleDragOver = (e: React.DragEvent) => {
    if (!dragInProgress.current) return;
    if (!workspaceRef.current) return;
    const rect = workspaceRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cellWidth = rect.width / gridCols;
    const cellHeight = rect.height / gridRows;
    const col = Math.max(0, Math.min(gridCols - 1, Math.floor(x / cellWidth)));
    const row = Math.max(0, Math.min(gridRows - 1, Math.floor(y / cellHeight)));
    const cell = { row, col };
    setActiveCell(cell);
    if (onGridDropInfo)
      onGridDropInfo({
        cell,
        size: { width: rect.width, height: rect.height },
      });
  };

  // Expose handleDragStart for parent usage if needed
  (window as any).mainWorkspaceHandleDragStart = () => {
    dragInProgress.current = true;
    setDragging(true);
  };
  return (
    <div
      ref={workspaceRef}
      style={{ position: 'relative', width: '100%', height: '100%' }}
      onDrop={(e) => {
        dragInProgress.current = false;
        setDragging(false);
        setActiveCell(null);
        if (onGridDropInfo) onGridDropInfo({ cell: null, size: containerSize });
        onDrop(e);
      }}
      onDragOver={(e) => {
        handleDragOver(e);
        onDragOver(e);
      }}
    >
      {children}
      <GridDropOverlay
        rows={gridRows}
        cols={gridCols}
        activeCell={activeCell}
        visible={dragging}
        top={56}
      />
    </div>
  );
};
