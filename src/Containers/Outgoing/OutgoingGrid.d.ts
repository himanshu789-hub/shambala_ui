import Observer from '../../Utilities/Observer';
import * as GridParams from './../../Components/AgGridComponent/Grid';
import { CustomPrice, IOutgoingShipmentUpdateDetail, Product } from './../../Types/DTO';
import { CaretSizeValue, CaretSizeValueOldAndNewValue } from './../../Components/AgGridComponent/Editors/CaretSizeEditor';
import { OutgoingGridRowCode, OutgoingStatusErrorCode } from 'Enums/Enum';


type GridContext = {
  getProductDetails(Id: number): Product;
  getColumnIndex(name: keyof OutgoingUpdateRow): number;
  IsOnUpdate: boolean;
}
export type CustomPriceRowData = GridParams.ValidationRowData<Omit<CustomPrice, 'Quantity'> & { Quantity: CaretSizeValue }>;

export type OutgoingUpdateRow = Omit<IOutgoingShipmentUpdateDetail, 'CustomPrices' | "TotalQuantityTaken" | 'TotalQuantityRejected' | 'TotalQuantityShiped' | 'TotalQuantityReturned'> & {
  CustomPrices: CustomPriceRowData[];
  TotalQuantityTaken: number;
  TotalQuantityRejected: CaretSizeValue;
  TotalQuantityShiped: number;
  TotalQuantityReturned: CaretSizeValue;
};
type RowNodeData = OutgoingUpdateRow & {
  Status: OutgoingGridRowCode
};
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
type QuantityValueParser = CaretSizeValueOldAndNewValue<GridParams.GridValueParserParams<CaretSizeValue, OutgoingGridRowValue, GridContext>>;
type CellClassParams = GridParams.GridCellClassParams<OutgoingGridRowValue>;
type ToolTipRendererParams = GridParams.GridToolTipParams<OutgoingGridRowValue>;
type RowClassParams = GridParams.RowStyleParams<RowNodeData, GridContext>;
type ValueFormatterParams<V> = GridParams.GridValueFormatterParams<OutgoingGridRowValue, GridContext, V>;