import Observer from '../../Utilities/Observer';
import * as GridParams from './../../Components/AgGridComponent/Grid';
import { CustomPrice, IOutgoingShipmentAddDetail, IOutgoingShipmentUpdateDetail, Product } from './../../Types/DTO';
import { CaretSizeValue, CaretSizeCellValueChangeEvent, CaretSizeEditorValueSetterParams, CaretSizeValueParserParams } from 'Components/AgGridComponent/Editors/CaretSizeEditor';

type GridContext = {
  getProductDetails(Id: number): Product;
  getColumnIndex(name: keyof OutgoingUpdateRow): number;
  IsOnUpdate: boolean;
}
export type CustomPriceRowData = GridParams.ValidationRowData<Omit<CustomPrice, 'Quantity'> & { Quantity: CaretSizeValue }>;

export type OutgoingUpdateRow = Omit<IOutgoingShipmentUpdateDetail, 'CustomPrices' | "TotalQuantityShiped" | 'TotalQuantityRejected' | 'TotalQuantitySale' | 'TotalQuantityReturned'> & {
  CustomPrices: CustomPriceRowData[];
  TotalQuantityShiped: CaretSizeValue;
  TotalQuantityRejected: CaretSizeValue;
  TotalQuantitySale: number;
  TotalQuantityReturned: CaretSizeValue;
};

interface IOutgoingGridRowValue {
  Id: string;
  Observer: Observer,
  Shipment: OutgoingUpdateRow;
}
type QuantitySetterParams = CaretSizeEditorValueSetterParams<>
type ValueGetterParams = GridParams.GridGetterParams<IOutgoingGridRowValue, GridContext>;
type ValueSetterParams<V> = GridParams.GridSetterParams<V, IOutgoingGridRowValue, GridContext>;
type CellRendererParams<V> = GridParams.GridRendererParams<V, IOutgoingGridRowValue, GridContext>;
type EditableCallbackParams = GridParams.GridEditableCallbackParams<IOutgoingGridRowValue>;
type CellEditorParams<V> = GridParams.GridEditorParams<C, IOutgoingGridRowValue, GridContext>;
type CellValueChangedEvent<V> = GridParams.GridCellValueChangeEvent<V, IOutgoingGridRowValue, GridContext>;
type OutgoingRowDataTransaction = GridParams.GridRowDataTransaction<IOutgoingGridRowValue>;
type QuantityValueParser = CaretSizeValueParserParams<GridParams.GridValueParserParams<CaretSizeValue,IOutgoingGridRowValue,GridContext>>;
type CellClassParams = GridParams.GridCellClassParams<IOutgoingGridRowValue>;
type ToolTipRendererParams = GridParams.GridToolTipParams<IOutgoingGridRowValue>;