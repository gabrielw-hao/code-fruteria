import React, { useState, useMemo, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { THEME_LIGHT } from '../constants';
import { COLORS } from '../constants/colors';
import ResizableDraggablePanel from '../components/ResizableDraggablePanel';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const getGridStyle = (theme: string): React.CSSProperties => ({
  background:
    theme === THEME_LIGHT ? COLORS.enrichmentBgLight : COLORS.enrichmentBgDark,
  border:
    theme === THEME_LIGHT
      ? `1.5px solid ${COLORS.enrichmentBorderLight}`
      : `1.5px solid ${COLORS.enrichmentBorderDark}`,
  borderRadius: 10,
  padding: '18px 24px',
  fontFamily: 'monospace',
  color:
    theme === THEME_LIGHT
      ? COLORS.enrichmentTextLight
      : COLORS.enrichmentTextDark,
  fontSize: 15,
  minWidth: 260,
  minHeight: 120,
  boxShadow: `0 2px 8px ${COLORS.enrichmentBoxShadow}`,
  margin: 0,
});

/**
 * Props for FruitEnrichmentPanel.
 */
interface FruitEnrichmentPanelProps {
  fruit: any;
  onClose: () => void;
}

/**
 * Displays enrichment details for a fruit in a draggable, resizable panel.
 * @param fruit The fruit object to display details for.
 * @param onClose Callback to close the panel.
 */
const FruitEnrichmentPanel: React.FC<FruitEnrichmentPanelProps> = ({
  fruit,
  onClose,
}) => {
  const { theme } = useTheme();
  const [panelState, setPanelState] = useState({
    x: 200,
    y: 120,
    width: 400,
    height: 220,
  });

  /**
   * Column definitions for the AG Grid.
   */
  const columnDefs = useMemo<ColDef<{ property: string; value: any }>[]>(
    () => [
      {
        headerName: 'Property',
        field: 'property',
        flex: 1,
        cellStyle: () => ({
          fontWeight: 700,
          color:
            theme === THEME_LIGHT ? COLORS.enrichmentTextLight : COLORS.white,
          fontFamily: 'inherit',
        }),
      },
      {
        headerName: 'Value',
        field: 'value',
        flex: 2,
        cellStyle: () => ({
          color:
            theme === THEME_LIGHT ? COLORS.enrichmentTextLight : COLORS.white,
          fontFamily: 'inherit',
        }),
      },
    ],
    [theme]
  );

  /**
   * Memoized row data for the grid.
   */
  const rowData = useMemo(
    () => [
      { property: 'ID', value: fruit.id },
      { property: 'Country', value: fruit.country },
      { property: 'Type', value: fruit.type },
      { property: 'Status', value: fruit.status },
      { property: 'Details', value: fruit.details },
    ],
    [fruit]
  );

  /**
   * Handles moving the panel.
   * @param dx Delta X
   * @param dy Delta Y
   */
  const handleMove = useCallback((dx: number, dy: number) => {
    setPanelState((prev) => ({
      ...prev,
      x: prev.x + dx,
      y: prev.y + dy,
    }));
  }, []);

  const handleResize = useCallback((dw: number, dh: number) => {
    setPanelState((prev) => ({
      ...prev,
      width: Math.max(320, prev.width + dw),
      height: Math.max(160, prev.height + dh),
    }));
  }, []);

  return (
    <ResizableDraggablePanel
      id={`fruit-enrichment-${fruit.id}`}
      title={`${fruit.name} Enrichment`}
      content={
        <div style={{ height: '100%', width: '100%' }}>
          <div
            className='ag-theme-alpine'
            style={
              {
                height: panelState.height - 40,
                width: '100%',
                background:
                  theme === THEME_LIGHT
                    ? COLORS.enrichmentBgLight
                    : COLORS.enrichmentBgDark,
                borderRadius: 10,
                fontSize: 15,
                color:
                  theme === THEME_LIGHT
                    ? COLORS.enrichmentTextLight
                    : COLORS.white,
                '--ag-header-background-color':
                  theme === THEME_LIGHT
                    ? COLORS.enrichmentBgAltLight
                    : COLORS.enrichmentBgAltDark,
                '--ag-header-foreground-color':
                  theme === THEME_LIGHT
                    ? COLORS.enrichmentTextLight
                    : COLORS.white,
                '--ag-background-color':
                  theme === THEME_LIGHT
                    ? COLORS.enrichmentBgLight
                    : COLORS.enrichmentBgDeepDark,
                '--ag-odd-row-background-color':
                  theme === THEME_LIGHT
                    ? COLORS.enrichmentBgLight
                    : COLORS.enrichmentBgAltDark,
                '--ag-row-hover-color':
                  theme === THEME_LIGHT
                    ? COLORS.enrichmentBlueLight
                    : COLORS.enrichmentBlueDark,
                '--ag-foreground-color':
                  theme === THEME_LIGHT
                    ? COLORS.enrichmentTextLight
                    : COLORS.white,
                '--ag-data-color':
                  theme === THEME_LIGHT
                    ? COLORS.enrichmentTextLight
                    : COLORS.white,
              } as React.CSSProperties
            }
          >
            <AgGridReact
              columnDefs={columnDefs}
              rowData={rowData}
              domLayout='autoHeight'
              headerHeight={32}
              rowHeight={32}
              suppressCellFocus={true}
              suppressMovableColumns={true}
              suppressMenuHide={true}
            />
          </div>
        </div>
      }
      x={panelState.x}
      y={panelState.y}
      width={panelState.width}
      height={panelState.height}
      minWidth={320}
      minHeight={160}
      onClose={onClose}
      onMove={handleMove}
      onResize={handleResize}
    />
  );
};

export default FruitEnrichmentPanel;
