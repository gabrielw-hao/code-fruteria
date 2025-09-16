import React, { useState, useRef, useCallback, useMemo } from 'react';
import FruitEnrichmentPanel from './FruitEnrichmentPanel';
import ReactDOM from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

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

const COLUMN_DEFS: ColDef[] = [
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
          ? '#7c5fe6'
          : params.value === 'Pending'
          ? '#ffb300'
          : '#e57373',
      fontWeight: 700,
      fontFamily: 'monospace',
      fontSize: 16,
      background: '#232b3e',
    }),
  },
  { headerName: 'Details', field: 'details', minWidth: 180 },
];

const DEFAULT_COL_DEF = {
  flex: 1,
  resizable: true,
};

const FruitBook: React.FC = () => {
  const [selectedFruit, setSelectedFruit] = useState<any | null>(null);
  const gridRef = useRef<any>(null);

  // Memoize grid row data and column defs
  const rowData = useMemo(() => FRUITS, []);
  const columnDefs = useMemo(() => COLUMN_DEFS, []);
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
          color: '#fff',
          background: '#7c5fe6',
        };
      }
      return {
        fontFamily: 'monospace',
        fontSize: 16,
        color: '#f5f5f5',
        background: params.node.rowIndex % 2 === 0 ? '#232b3e' : '#262f47',
      };
    },
    [selectedFruit]
  );

  return (
    <>
      <div style={{ padding: 0, background: '#232b3e' }}>
        <div
          style={{
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: 22,
            color: '#fff',
            background: '#232b3e',
            padding: '16px 24px 10px 24px',
            borderBottom: '1px solid #353b4a',
            letterSpacing: 1,
            minWidth: 700,
          }}
        >
          Fruit Book
        </div>
        <div
          className='ag-theme-alpine'
          style={{
            height: 460,
            width: '100%',
            minWidth: 700,
            border: '1px solid #7c5fe6',
          }}
        >
          <AgGridReact<any>
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            headerHeight={38}
            rowHeight={38}
            rowSelection='single'
            onSelectionChanged={onSelectionChanged}
            onRowDoubleClicked={onRowDoubleClicked}
            getRowStyle={getRowStyle}
            suppressCellFocus={true}
            pagination={true}
            paginationPageSize={10}
          />
        </div>
      </div>
      {selectedFruit &&
        ReactDOM.createPortal(
          <FruitEnrichmentPanel
            fruit={selectedFruit}
            onClose={() => setSelectedFruit(null)}
          />,
          document.body
        )}
    </>
  );
};

export default FruitBook;
