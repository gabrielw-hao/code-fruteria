import React, { useState, useRef, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import FruitEnrichmentPanel from './FruitEnrichmentPanel';
import ReactDOM from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { THEME_LIGHT } from '../constants';
import { COLORS } from '../constants/colors';

const BookPanelWrapper = styled.div<{ $themeType: 'dark' | 'light' }>`
  padding: 0;
  background: ${({ $themeType }) =>
    $themeType === THEME_LIGHT
      ? COLORS.fruitBookBgLight
      : COLORS.fruitBookBgDark};
`;

const BookPanelHeader = styled.div<{ $themeType: 'dark' | 'light' }>`
  font-family: monospace;
  font-weight: 700;
  font-size: 22px;
  color: ${({ $themeType }) =>
    $themeType === THEME_LIGHT ? COLORS.fruitBookDataColorLight : COLORS.white};
  background: ${({ $themeType }) =>
    $themeType === THEME_LIGHT
      ? COLORS.fruitBookBgLight
      : COLORS.fruitBookBgDark};
  padding: 16px 24px 10px 24px;
  border-bottom: ${({ $themeType }) =>
    $themeType === THEME_LIGHT
      ? `1px solid ${COLORS.fruitBookBorderLight}`
      : `1px solid ${COLORS.fruitBookBorderDark}`};
  letter-spacing: 1px;
  min-width: 700px;
`;

const StyledAgGridWrapper = styled.div<{ $themeType: 'dark' | 'light' }>`
  height: 460px;
  width: 100%;
  min-width: 700px;
  border: ${({ $themeType }) =>
    $themeType === THEME_LIGHT
      ? `1px solid ${COLORS.fruitBookBorderLight}`
      : `1px solid ${COLORS.fruitBookSecondary}`};
  background: ${({ $themeType }) =>
    $themeType === THEME_LIGHT
      ? COLORS.fruitBookBgLight
      : COLORS.fruitBookBgDark};
  --ag-header-background-color: ${({ $themeType }) =>
    $themeType === THEME_LIGHT
      ? COLORS.fruitBookBgAltLight
      : COLORS.fruitBookBgDark};
  --ag-header-foreground-color: ${({ $themeType }) =>
    $themeType === THEME_LIGHT
      ? COLORS.fruitBookDataColorLight
      : COLORS.fruitBookDataColorDark};
  --ag-background-color: ${({ $themeType }) =>
    $themeType === THEME_LIGHT
      ? COLORS.fruitBookBgLight
      : COLORS.fruitBookBgDeepDark};
  --ag-odd-row-background-color: ${({ $themeType }) =>
    $themeType === THEME_LIGHT
      ? COLORS.fruitBookBgLight
      : COLORS.fruitBookBgDark};
  --ag-row-hover-color: ${({ $themeType }) =>
    $themeType === THEME_LIGHT
      ? COLORS.fruitBookBlueLight
      : COLORS.fruitBookBorderDark};
  --ag-foreground-color: ${({ $themeType }) =>
    $themeType === THEME_LIGHT
      ? COLORS.fruitBookDataColorLight
      : COLORS.fruitBookDataColorDark};
  --ag-data-color: ${({ $themeType }) =>
    $themeType === THEME_LIGHT
      ? COLORS.fruitBookDataColorLight
      : COLORS.fruitBookDataColorDark};
`;

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
            ? COLORS.fruitBookPrimary
            : COLORS.fruitBookSecondary
          : params.value === 'Pending'
          ? theme === THEME_LIGHT
            ? COLORS.fruitBookGold
            : COLORS.fruitBookYellow
          : theme === THEME_LIGHT
          ? COLORS.fruitBookRed
          : COLORS.fruitBookLightRed,
      fontWeight: 700,
      fontFamily: 'monospace',
      fontSize: 16,
      background:
        theme === THEME_LIGHT
          ? COLORS.fruitBookBgLight
          : COLORS.fruitBookBgDark,
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
          color:
            theme === THEME_LIGHT
              ? COLORS.fruitBookDataColorLight
              : COLORS.white,
          background: COLORS.fruitBookSecondary,
        };
      }
      return {
        fontFamily: 'monospace',
        fontSize: 16,
        color:
          theme === THEME_LIGHT ? COLORS.fruitBookDataColorLight : '#f5f5f5',
        background:
          theme === THEME_LIGHT
            ? params.node.rowIndex % 2 === 0
              ? COLORS.fruitBookBgLight
              : COLORS.fruitBookBgAltLight
            : params.node.rowIndex % 2 === 0
            ? COLORS.fruitBookBgDark
            : COLORS.fruitBookBgAltDark,
      };
    },
    [selectedFruit, theme]
  );

  return (
    <BookPanelWrapper $themeType={theme}>
      <BookPanelHeader $themeType={theme}>Fruit Book</BookPanelHeader>
      <StyledAgGridWrapper $themeType={theme} className='ag-theme-alpine'>
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
      </StyledAgGridWrapper>
      {selectedFruit &&
        ReactDOM.createPortal(
          <FruitEnrichmentPanel
            fruit={selectedFruit}
            onClose={() => setSelectedFruit(null)}
          />,
          document.body
        )}
    </BookPanelWrapper>
  );
};

export default FruitBook;
