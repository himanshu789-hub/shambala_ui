import Observer from '../../Utilities/Observer';
import * as GridParams from './../../Components/AgGridComponent/Grid';
import { CustomPrice, IOutgoingShipmentUpdateDetail, Product } from './../../Types/DTO';
import { CaretSizeValue, CaretSizeValueParserParams } from './../../Components/AgGridComponent/Editors/CaretSizeEditor';


type GridContext = {
  getProductDetails(Id: number): Product;
  getColumnIndex(name: keyof OutgoingUpdateRow): number;
  IsOnUpdate: boolean;
}
export type CustomPriceRowData = GridParams.ValidationRowData<Omit<CustomPrice, 'Quantity'> & { Quantity: CaretSizeValue }>;

export type OutgoingUpdateRow = Omit<IOutgoingShipmentUpdateDetail, 'CustomPrices' | "TotalQuantityTaken" | 'TotalQuantityRejected' | 'TotalQuantityShiped' | 'TotalQuantityReturned'> & {
  CustomPrices: CustomPriceRowData[];
  TotalQuantityTaken: CaretSizeValue;
  TotalQuantityRejected: CaretSizeValue;
  TotalQuantityShiped: number;
  TotalQuantityReturned: CaretSizeValue;
};
type RowNodeData = OutgoingUpdateRow;
type OutgoingGridRowValue = {
  Id: string;
  Observer: Observer,
  Shipment: RowNodeData;
}

type ValueGetterParams = GridParams.GridGetterParams<OutgoingGridRowValue, GridContext>;
type ValueSetterParams<V> = GridParams.GridSetterParams<V, OutgoingGridRowValue, GridContext>;
type CellRendererParams<V> = GridParams.GridRendererParams<V, OutgoingGridRowValue, GridContext>;
type EditableCallbackParams = GridParams.GridEditableCallbackParams<OutgoingGridRowValue>;
type CellEditorParams<V> = GridParams.GridEditorParams<V, OutgoingGridRowValue, GridContext>;
type CellValueChangedEvent<V> = GridParams.GridCellValueChangeEvent<V, OutgoingGridRowValue, GridContext>;
type OutgoingRowDataTransaction = GridParams.GridRowDataTransaction<OutgoingGridRowValue>;
type QuantityValueParser = CaretSizeValueParserParams<GridParams.GridValueParserParams<CaretSizeValue, OutgoingGridRowValue, GridContext>>;
type CellClassParams = GridParams.GridCellClassParams<OutgoingGridRowValue>;
type ToolTipRendererParams = GridParams.GridToolTipParams<OutgoingGridRowValue>;
type RowClassParams = GridParams.RowStyleParams<RowNodeData, GridContext>;