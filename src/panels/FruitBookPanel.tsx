import React, { useState, useRef, useCallback, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import FruitEnrichmentPanel from './FruitEnrichmentPanel';
import ReactDOM from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { THEME_LIGHT } from '../constants';

// Register ag-grid modules (required for module-based builds)
ModuleRegistry.registerModules([AllCommunityModule]);

const FRUITS = [
  {
    id: 'F001',
    name: 'Banana',
    country: 'Ecuador',
    type: 'Tropical',
    status: 'Available',
    details: 'Organic, Fair Trade',
  },
  {
    id: 'F002',
    name: 'Apple',
    country: 'Spain',
    type: 'Temperate',
    status: 'Available',
    details: 'Fuji, Premium',
  },
  {
    id: 'F003',
    name: 'Orange',
    country: 'Morocco',
    type: 'Citrus',
    status: 'Low Stock',
    details: 'Navel, Sweet',
  },
  {
    id: 'F004',
    name: 'Kiwi',
    country: 'New Zealand',
    type: 'Berry',
    status: 'Available',
    details: 'Green, Large',
  },
  {
    id: 'F005',
    name: 'Mango',
    country: 'Peru',
    type: 'Tropical',
    status: 'Pending',
    details: 'Kent, Air Freight',
  },
  {
    id: 'F006',
    name: 'Pineapple',
    country: 'Costa Rica',
    type: 'Tropical',
    status: 'Available',
    details: 'Extra Sweet',
  },
  {
    id: 'F007',
    name: 'Grape',
    country: 'Italy',
    type: 'Berry',
    status: 'Available',
    details: 'Red Globe',
  },
  {
    id: 'F008',
    name: 'Pear',
    country: 'Argentina',
    type: 'Temperate',
    status: 'Available',
    details: 'Williams, Fresh',
  },
  {
    id: 'F009',
    name: 'Lime',
    country: 'Mexico',
    type: 'Citrus',
    status: 'Low Stock',
    details: 'Seedless',
  },
  {
    id: 'F010',
    name: 'Papaya',
    country: 'Brazil',
    type: 'Tropical',
    status: 'Available',
    details: 'Formosa',
  },
];

const getColumnDefs = (theme: 'dark' | 'light'): ColDef[] => [
  { headerName: 'ID', field: 'id', minWidth: 90 },
  { headerName: 'Fruit', field: 'name', minWidth: 120 },
  { headerName: 'Country', field: 'country', minWidth: 120 },
  { headerName: 'Type', field: 'type', minWidth: 120 },
  {
    headerName: 'Status',
    field: 'status',
    minWidth: 120,
    cellStyle: (params: any) => ({
      color:
        params.value === 'Available'
          ? theme === THEME_LIGHT
            ? '#5a3ec8'
            : '#7c5fe6'
          : params.value === 'Pending'
          ? theme === THEME_LIGHT
            ? '#b97b00'
            : '#ffb300'
          : theme === THEME_LIGHT
          ? '#c0392b'
          : '#e57373',
      fontWeight: 700,
      fontFamily: 'monospace',
      fontSize: 16,
      background: theme === THEME_LIGHT ? '#f5f6fa' : '#232b3e',
    }),
  },
  { headerName: 'Details', field: 'details', minWidth: 180 },
];

const DEFAULT_COL_DEF = {
  flex: 1,
  resizable: true,
};

const FruitBook: React.FC = () => {
  const { theme } = useTheme();
  const [selectedFruit, setSelectedFruit] = useState<any | null>(null);
  const gridRef = useRef<any>(null);

  // Memoize grid row data and column defs
  const rowData = useMemo(() => FRUITS, []);
  const columnDefs = useMemo(() => getColumnDefs(theme), [theme]);
  const defaultColDef = useMemo(() => DEFAULT_COL_DEF, []);

  // Handlers
  const onRowDoubleClicked = useCallback((event: any) => {
    setSelectedFruit(event.data);
  }, []);

  const onSelectionChanged = useCallback(() => {
    const selectedNodes = gridRef.current?.api.getSelectedNodes();
    if (selectedNodes && selectedNodes.length > 0) {
      setSelectedFruit(selectedNodes[0].data);
    }
  }, []);

  const getRowStyle = useCallback(
    (params: any) => {
      if (selectedFruit && params.data.id === selectedFruit.id) {
        return {
          fontFamily: 'monospace',
          fontSize: 16,
          color: theme === THEME_LIGHT ? '#232634' : '#fff',
          background: '#7c5fe6',
        };
      }
      return {
        fontFamily: 'monospace',
        fontSize: 16,
        color: theme === THEME_LIGHT ? '#232634' : '#f5f5f5',
        background:
          theme === THEME_LIGHT
            ? params.node.rowIndex % 2 === 0
              ? '#f5f6fa'
              : '#e9ecf3'
            : params.node.rowIndex % 2 === 0
            ? '#232b3e'
            : '#262f47',
      };
    },
    [selectedFruit, theme]
  );

  return (
    <div
      style={{
        padding: 0,
        background: theme === THEME_LIGHT ? '#f5f6fa' : '#232b3e',
      }}
    >
      <div
        style={{
          fontFamily: 'monospace',
          fontWeight: 700,
          fontSize: 22,
          color: theme === THEME_LIGHT ? '#232634' : '#fff',
          background: theme === THEME_LIGHT ? '#f5f6fa' : '#232b3e',
          padding: '16px 24px 10px 24px',
          borderBottom:
            theme === THEME_LIGHT ? '1px solid #dbe2ef' : '1px solid #353b4a',
          letterSpacing: 1,
          minWidth: 700,
        }}
      >
        Fruit Book
      </div>
      <div
        className='ag-theme-alpine'
        style={
          {
            height: 460,
            width: '100%',
            minWidth: 700,
            border:
              theme === THEME_LIGHT ? '1px solid #dbe2ef' : '1px solid #7c5fe6',
            background: theme === THEME_LIGHT ? '#f5f6fa' : '#232b3e',
            '--ag-header-background-color':
              theme === THEME_LIGHT ? '#e9ecf3' : '#232b3e',
            '--ag-header-foreground-color':
              theme === THEME_LIGHT ? '#232634' : '#e0e6f5',
            '--ag-background-color':
              theme === THEME_LIGHT ? '#f5f6fa' : '#181c24',
            '--ag-odd-row-background-color':
              theme === THEME_LIGHT ? '#f5f6fa' : '#232b3e',
            '--ag-row-hover-color':
              theme === THEME_LIGHT ? '#e0e7ff' : '#353b4a',
            '--ag-foreground-color':
              theme === THEME_LIGHT ? '#232634' : '#e0e6f5',
            '--ag-data-color': theme === THEME_LIGHT ? '#232634' : '#e0e6f5',
          } as React.CSSProperties
        }
      >
        <AgGridReact<any>
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          headerHeight={38}
          rowHeight={38}
          rowSelection={{ mode: 'singleRow' }}
          onSelectionChanged={onSelectionChanged}
          onRowDoubleClicked={onRowDoubleClicked}
          getRowStyle={getRowStyle}
          suppressCellFocus={true}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50, 100]}
        />
      </div>
      {selectedFruit &&
        ReactDOM.createPortal(
          <FruitEnrichmentPanel
            fruit={selectedFruit}
            onClose={() => setSelectedFruit(null)}
          />,
          document.body
        )}
    </div>
  );
};

export default FruitBook;
