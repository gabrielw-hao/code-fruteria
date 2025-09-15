import React, { useRef, useState, useEffect } from 'react';

type Props = {
  id?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  title?: string;
  content?: React.ReactNode;
  onMove?: (dx: number, dy: number) => void;
  onResize?: (dw: number, dh: number) => void;
  onClose?: () => void;
  minWidth?: number;
  minHeight?: number;
};

const DEFAULT_MIN_W = 200;
const DEFAULT_MIN_H = 100;

const ResizableDraggablePanel: React.FC<Props> = ({
  x,
  y,
  width,
  height,
  title,
  content,
  onMove,
  onResize,
  onClose,
  minWidth,
  minHeight,
}) => {
  const effectiveMinW = minWidth ?? DEFAULT_MIN_W;
  const effectiveMinH = minHeight ?? DEFAULT_MIN_H;

  const movingRef = useRef(false);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);

  const resizingRef = useRef(false);
  const lastResX = useRef(0);
  const lastResY = useRef(0);

  const [preview, setPreview] = useState<{
    w: number;
    h: number;
    active: boolean;
  }>({
    w: width,
    h: height,
    active: false,
  });

  useEffect(() => {
    setPreview((p) => ({ ...p, w: width, h: height }));
  }, [width, height]);

  const onHeaderMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    movingRef.current = true;
    lastMouseX.current = e.clientX;
    lastMouseY.current = e.clientY;
    document.body.style.userSelect = 'none';

    const onMoveWindow = (mv: MouseEvent) => {
      if (!movingRef.current) return;
      const dx = mv.clientX - lastMouseX.current;
      const dy = mv.clientY - lastMouseY.current;
      lastMouseX.current = mv.clientX;
      lastMouseY.current = mv.clientY;
      onMove?.(dx, dy);
    };
    const onUpWindow = () => {
      movingRef.current = false;
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMoveWindow);
      window.removeEventListener('mouseup', onUpWindow);
    };

    window.addEventListener('mousemove', onMoveWindow);
    window.addEventListener('mouseup', onUpWindow);
  };

  const onResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resizingRef.current = true;
    lastResX.current = e.clientX;
    lastResY.current = e.clientY;
    setPreview({ w: width, h: height, active: true });
    document.body.style.userSelect = 'none';

    const onMoveWindow = (mv: MouseEvent) => {
      if (!resizingRef.current) return;
      const dx = mv.clientX - lastResX.current;
      const dy = mv.clientY - lastResY.current;
      lastResX.current = mv.clientX;
      lastResY.current = mv.clientY;

      onResize?.(dx, dy);

      setPreview((prev) => {
        const newW = Math.max(effectiveMinW, Math.round(prev.w + dx));
        const newH = Math.max(effectiveMinH, Math.round(prev.h + dy));
        return { w: newW, h: newH, active: true };
      });
    };

    const onUpWindow = () => {
      resizingRef.current = false;
      setPreview((p) => ({ ...p, active: false }));
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMoveWindow);
      window.removeEventListener('mouseup', onUpWindow);
    };

    window.addEventListener('mousemove', onMoveWindow);
    window.addEventListener('mouseup', onUpWindow);
  };

  useEffect(() => {
    if (!resizingRef.current) {
      setPreview({ w: width, h: height, active: false });
    }
  }, [width, height]);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        boxSizing: 'border-box',
        background: 'var(--panel-bg, #fff)',
        borderRadius: 6,
        boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
        overflow: 'hidden',
        zIndex: 3000,
      }}
    >
      <div
        onMouseDown={onHeaderMouseDown}
        style={{
          height: 40,
          background:
            'var(--panel-header-bg, linear-gradient(90deg,#3e4a6b,#2b3556))',
          color: 'var(--panel-header-fg, #fff)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          cursor: 'grab',
          userSelect: 'none',
        }}
      >
        <div style={{ fontWeight: 700 }}>{title}</div>
        <div style={{ flex: 1 }} />
        <button
          onClick={(ev) => {
            ev.stopPropagation();
            onClose?.();
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--panel-header-fg, #fff)',
            cursor: 'pointer',
            fontSize: 16,
          }}
        >
          ✕
        </button>
      </div>

      <div
        style={{ padding: 12, height: 'calc(100% - 40px)', overflow: 'auto' }}
      >
        {content}
      </div>

      <div
        onMouseDown={onResizeMouseDown}
        style={{
          position: 'absolute',
          right: 6,
          bottom: 6,
          width: 18,
          height: 18,
          cursor: 'nwse-resize',
          zIndex: 4000,
          borderRadius: 3,
          background: 'rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-hidden
      >
        <svg
          width='12'
          height='12'
          viewBox='0 0 12 12'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M2 10L10 2M6 10L10 6M2 6L6 2'
            stroke='rgba(0,0,0,0.35)'
            strokeWidth='1.2'
            strokeLinecap='round'
          />
        </svg>
      </div>

      {preview.active && (
        <div
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            left: 0,
            top: 0,
            width: preview.w,
            height: preview.h,
            boxSizing: 'border-box',
            borderRadius: 6,
            border: '2px dashed rgba(100,150,255,0.9)',
            background: 'rgba(100,150,255,0.08)',
            zIndex: 5000,
            transition: 'none',
          }}
        />
      )}
    </div>
  );
};

export default ResizableDraggablePanel;
