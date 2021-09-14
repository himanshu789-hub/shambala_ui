import { IQuantityMediatorWrapper } from '../../../../Utilities/QuatityMediatorWrapper';
import { GridCellValueChangeEvent, GridEditorParams, GridGetterParams, GridRendererParams, GridRowDataTransaction, GridSetterParams, GridValueParserParams, GridCellClassParams } from '../../../../Components/AgGridComponent/Grid.d';
import { CustomPrice } from './../../../../Types/DTO.d';

type CustomPriceRowData = CustomPrice;
type GridData = {
    CaretSize: number;
    Data: CustomPriceRowData[];
    DefaultPrice: number;
    QuantityLimit: number;
}
type CustomPriceProps = {
    initialData: GridData;
}
type PriceGridContext = {
    getCaretSize: () => number;
    getQuantityMediator(): IQuantityMediatorWrapper;
};
type CustomPriceGridEditorParams<V> = GridEditorParams<V, CustomPriceRowData, PriceGridContext>;
type CustomPriceGridCellRendererParams<V> = GridRendererParams<V, CustomPriceRowData, PriceGridContext>;
type CustomPriceGridValueGetterParams = GridGetterParams<CustomPriceRowData, PriceGridContext>;
type CustomPriceCellValueChnageEvent<V> = GridCellValueChangeEvent<V, CustomPrice, PriceGridContext>;
type CustomPriceValueSetterPrams<V> = GridSetterParams<V, CustomPrice, PriceGridContext>;
type RowTransactionData = GridRowDataTransaction<CustomPriceRowData>;
type CustomPriceClassParams = GridCellClassParams<CustomPriceRowData,PriceGridContext>;