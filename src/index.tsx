import 'antd/dist/antd.css';
import React, { useState, DragEvent, FC, StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import ResizableDraggablePanel from './components/ResizableDraggablePanel';
import TermsIcon from './Icons/TermsIcon';
import AboutIcon from './Icons/AboutIcon';
import FruitViewIcon from './Icons/FruitViewIcon';
import { MainWorkspace } from './components/MainWorkspace';
import LoginComponent from './components/LoginComponent';
import UserProfile from './components/UserProfile';
import { panelList } from './panelList';

/**
 * Represents an open panel's state and position.
 */
type OpenPanel = {
  id: string;
  key: string;
  title: string;
  content: React.ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Returns the default position and size for a new panel.
 * @param count Number of currently open panels
 */
const getDefaultPanelPosition = (count: number) => ({
  x: 60 + count * 40,
  y: 60 + count * 40,
  width: 700,
  height: 420,
});

const GRID_ROWS = 2;
const GRID_COLS = 2;

/**
 * Calculates the position and size of a grid cell.
 * @param row Row index
 * @param col Column index
 * @param containerWidth Width of the container
 * @param containerHeight Height of the container
 * @param navBarHeight Height of the navigation bar
 */
const getGridCellPosition = (
  row: number,
  col: number,
  containerWidth: number,
  containerHeight: number,
  navBarHeight: number
) => {
  const cellWidth = containerWidth / GRID_COLS;
  const cellHeight = containerHeight / GRID_ROWS;
  return {
    x: Math.round(col * cellWidth),
    y: Math.round(row * cellHeight + navBarHeight),
    width: Math.round(cellWidth),
    height: Math.round(cellHeight),
  };
};

const NAV_BAR_HEIGHT = 56; // px, must match your nav bar minHeight

/**
 * Checks if the user is logged in.
 * @returns {boolean}
 */
const isLoggedIn = () => localStorage.getItem('isLoggedIn') === 'true';

const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes

const THEME_KEY = 'theme'; // localStorage key

const RESIZE_SENSITIVITY = 1;

/**
 * Gets the initial theme from localStorage or prompts the user.
 * @returns {'dark' | 'light'}
 */
const getInitialTheme = () => {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  // Ask user if not set
  const userPref = window.confirm(
    'Use dark theme? Click OK for dark, Cancel for light.'
  );
  const theme = userPref ? 'dark' : 'light';
  localStorage.setItem(THEME_KEY, theme);
  return theme;
};

/**
 * Main application component.
 */
const App: FC = () => {
  const [openPanels, setOpenPanels] = useState<OpenPanel[]>([]);
  const [dragNavPanelKey, setDragNavPanelKey] = useState<string | null>(null);
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [dropCell, setDropCell] = useState<{ row: number; col: number } | null>(
    null
  );
  const [theme, setTheme] = useState<'dark' | 'light'>(getInitialTheme());

  // Drag from nav: set key in dataTransfer
  /**
   * Handles drag start from the navigation bar.
   * @param key Panel key
   */
  const onNavDragStart = (key: string) => (e: DragEvent<HTMLLIElement>) => {
    setDragNavPanelKey(key);
    e.dataTransfer.setData('panelKey', key);
  };

  /**
   * Called by MainWorkspace to update container size and drop cell.
   */
  const handleGridDropInfo = (info: {
    cell: { row: number; col: number } | null;
    size: { width: number; height: number };
  }) => {
    setDropCell(info.cell);
    setContainerSize(info.size);
  };

  /**
   * Handles drop event on the main workspace to open a new panel.
   */
  const onMainDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const key = e.dataTransfer.getData('panelKey');
    if (!key) return;
    const panelDef = panelList.find((p) => p.key === key);
    if (!panelDef) return;
    const id = `${key}-${Date.now()}`;
    let x = 60,
      y = NAV_BAR_HEIGHT + 10,
      width = 700,
      height = 420;
    if (dropCell && containerSize.width && containerSize.height) {
      // Subtract nav bar height from available height for grid
      const availableHeight = containerSize.height - NAV_BAR_HEIGHT;
      const pos = getGridCellPosition(
        dropCell.row,
        dropCell.col,
        containerSize.width,
        availableHeight,
        NAV_BAR_HEIGHT
      );
      // Clamp width/height to not exceed window
      width = Math.min(pos.width, containerSize.width);
      height = Math.min(pos.height, availableHeight);
      x = pos.x;
      y = pos.y;
    }
    setOpenPanels([
      ...openPanels,
      {
        id,
        key: panelDef.key,
        title: panelDef.title,
        content: panelDef.content,
        x,
        y,
        width,
        height,
      },
    ]);
    setDragNavPanelKey(null);
  };

  /**
   * Handles drag over event on the main workspace.
   */
  const onMainDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  /**
   * Closes a panel by id.
   */
  const handleClose = (id: string) => {
    setOpenPanels(openPanels.filter((p) => p.id !== id));
  };

  /**
   * Moves a panel by delta x and y.
   */
  const handlePanelMove = (id: string, dx: number, dy: number) => {
    setOpenPanels((panels) =>
      panels.map((p) => (p.id === id ? { ...p, x: p.x + dx, y: p.y + dy } : p))
    );
  };

  /**
   * Resizes a panel by delta width and height.
   */
  const handlePanelResize = (id: string, dw: number, dh: number) => {
    const scaledDw = Math.round(dw * RESIZE_SENSITIVITY);
    const scaledDh = Math.round(dh * RESIZE_SENSITIVITY);

    setOpenPanels((panels) =>
      panels.map((p) =>
        p.id === id
          ? {
              ...p,
              width: Math.max(200, p.width + scaledDw),
              height: Math.max(100, p.height + scaledDh),
            }
          : p
      )
    );
  };

  // Inactivity logout timer
  React.useEffect(() => {
    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        localStorage.removeItem('isLoggedIn');
        window.dispatchEvent(new Event('login-success'));
      }, INACTIVITY_LIMIT);
    };

    const activityEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );
    resetTimer();

    return () => {
      if (timer) clearTimeout(timer);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, []);

  // Set theme class on body or root
  useEffect(() => {
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  /**
   * Toggles the application theme between dark and light.
   */
  const handleThemeToggle = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, next);
      return next;
    });
  };

  return (
    <div
      className={`app-root theme-${theme}`}
      style={{ display: 'flex', height: '100vh' }}
    >
      {/* Navigation Bar */}
      {navOpen && (
        <nav
          style={{
            width: 90, // Increased width
            background: '#232b3e',
            padding: '0.5rem 0.25rem',
            borderRight: '1px solid #3e4a6b',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: 90, // Increased minWidth
            boxSizing: 'border-box',
          }}
        >
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {panelList.map((panel) => (
              <li
                key={panel.key}
                style={{
                  marginBottom: 16,
                  cursor: 'grab',
                  fontWeight: 'normal',
                  background:
                    dragNavPanelKey === panel.key ? '#353b4a' : undefined,
                  padding: 8,
                  borderRadius: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  color: '#e0e0e0',
                  width: '100%',
                  transition: 'background 0.2s',
                  textAlign: 'center', // Center text
                  minHeight: 64,
                }}
                draggable
                onDragStart={onNavDragStart(panel.key)}
                onDragEnd={() => setDragNavPanelKey(null)}
                title={panel.title}
              >
                <span style={{ marginBottom: 4 }}>
                  {panel.key === 'fruitbook' ? (
                    <TermsIcon />
                  ) : panel.key === 'fruitview' ? (
                    <FruitViewIcon />
                  ) : panel.key === 'about' ? (
                    <AboutIcon />
                  ) : null}
                </span>
                <span
                  style={{
                    width: '100%',
                    textAlign: 'center', // Center text
                    fontSize: 13,
                    fontWeight: 500,
                    lineHeight: 1.2,
                    wordBreak: 'break-word',
                  }}
                >
                  {panel.title}
                </span>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Panel Area */}
      <MainWorkspace
        onDrop={onMainDrop}
        onDragOver={onMainDragOver}
        onGridDropInfo={handleGridDropInfo}
        gridRows={GRID_ROWS}
        gridCols={GRID_COLS}
      >
        <main
          style={{
            flex: 1,
            position: 'relative',
            background: '#232b3e',
            overflow: 'hidden',
            height: '100%',
            width: '100%',
          }}
        >
          {/* Top nav branding */}
          <div
            style={{
              width: '100%',
              background: 'linear-gradient(90deg, #2b3556 0%, #3e4a6b 100%)',
              color: '#fff',
              padding: '0.5rem 1.5rem',
              fontWeight: 600,
              fontSize: 20,
              letterSpacing: 1,
              position: 'sticky',
              top: 0,
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 2px 8px #0002',
              minHeight: NAV_BAR_HEIGHT,
              borderBottom: '1px solid #3e4a6b',
            }}
          >
            {/* Hamburger/X icon */}
            <button
              onClick={() => setNavOpen((v) => !v)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: 26,
                cursor: 'pointer',
                marginRight: 20,
                display: 'flex',
                alignItems: 'center',
                padding: 0,
                height: 40,
                width: 40,
                borderRadius: 8,
                transition: 'background 0.2s',
                boxShadow: navOpen ? '0 2px 8px #0002' : undefined,
              }}
              aria-label='Toggle navigation'
            >
              <span style={{ display: 'inline-block', width: 28, height: 28 }}>
                {navOpen ? (
                  // X icon
                  <svg width='28' height='28' viewBox='0 0 28 28'>
                    <line
                      x1='7'
                      y1='7'
                      x2='21'
                      y2='21'
                      stroke='#fff'
                      strokeWidth='2.5'
                      strokeLinecap='round'
                    />
                    <line
                      x1='21'
                      y1='7'
                      x2='7'
                      y2='21'
                      stroke='#fff'
                      strokeWidth='2.5'
                      strokeLinecap='round'
                    />
                  </svg>
                ) : (
                  // Hamburger icon
                  <svg width='28' height='28' viewBox='0 0 28 28'>
                    <rect y='6' width='28' height='3' rx='1.5' fill='#fff' />
                    <rect y='13' width='28' height='3' rx='1.5' fill='#fff' />
                    <rect y='20' width='28' height='3' rx='1.5' fill='#fff' />
                  </svg>
                )}
              </span>
            </button>
            {/* App title */}
            <span
              style={{
                fontFamily: 'monospace',
                fontWeight: 700,
                fontSize: 22,
                letterSpacing: 2,
                color: '#fff',
                textShadow: '0 1px 2px #0006',
                userSelect: 'none',
                textTransform: 'uppercase',
              }}
            >
              fruteria
            </span>
            {/* Spacer to push UserProfile to the right */}
            <div style={{ flex: 1 }} />
            {/* UserProfile on the right */}
            <div style={{ marginRight: 32 }}>
              <UserProfile
                onLogout={() => {
                  localStorage.removeItem('isLoggedIn');
                  window.dispatchEvent(new Event('login-success'));
                }}
                onThemeToggle={handleThemeToggle}
                theme={theme}
              />
            </div>
          </div>
          {openPanels.length === 0 ? (
            <div
              style={{ color: '#888', textAlign: 'center', marginTop: '2rem' }}
            >
              No panels open.
              <br />
              Drag one from the navigation bar.
            </div>
          ) : (
            openPanels.map((panel) => (
              <ResizableDraggablePanel
                key={panel.id}
                {...panel}
                onClose={() => handleClose(panel.id)}
                onMove={(dx, dy) => handlePanelMove(panel.id, dx, dy)}
                onResize={(dw, dh) => handlePanelResize(panel.id, dw, dh)}
                // Add a prop to indicate dragging for overlay z-index if needed
              />
            ))
          )}
        </main>
      </MainWorkspace>
    </div>
  );
};

/**
 * Root component that handles login state.
 */
const Root: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  useEffect(() => {
    // Listen for login event from LoginComponent
    const handler = () => setLoggedIn(isLoggedIn());
    window.addEventListener('login-success', handler);
    return () => window.removeEventListener('login-success', handler);
  }, []);

  if (!loggedIn) {
    return <LoginComponent />;
  }
  return <App />;
};

// Patch LoginComponent to set login flag and dispatch event
// (You can move this logic inside LoginComponent if you prefer)
const origLoginComponent = LoginComponent;
(LoginComponent as any) = (props: any) => {
  const [_, forceUpdate] = React.useReducer((x) => x + 1, 0);
  return React.createElement(origLoginComponent, {
    ...props,
    onLoginSuccess: () => {
      localStorage.setItem('isLoggedIn', 'true');
      window.dispatchEvent(new Event('login-success'));
      forceUpdate();
    },
  });
};

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <Root />
    </StrictMode>
  );
} else {
  console.error('Root element not found');
}
