import Observer from '../../Utilities/Observer';
import * as GridParams from './../../Components/AgGridComponent/Grid';
import { CustomPrice, IOutgoingShipmentAddDetail, IOutgoingShipmentUpdateDetail } from './../../Types/DTO';
import { CaretSizeValue ,CaretSizeCellValueChangeEvemt} from 'Components/AgGridComponent/Editors/CaretSizeEditor';

type GridContext = {
  getProductDefaultPrice(Id: number): number;
  getColumnIndex(name:keyof OutgoingUpdateRow):number;
}
export type CustomPriceRowData = GridParams.ValidationRowData<Omit<CustomPrice, 'Quantity'> & { Quantity: CaretSizeValue }>;

export type OutgoingUpdateRow = (Omit<IOutgoingShipmentUpdateDetail, 'CustomPrices'| 'TotalQuantityShiped'| 'TotalQuantityRejected'| 'TotalQuantitySale'>
  & {
    CustomPrices: CustomPriceRowData[];
    TotalQuantityShiped: CaretSizeEditorValue;
    TotalQuantityRejected: CaretSizeEditorValue;
    TotalQuantitySale: CaretSizeEditorValue;
  });

interface IOutogingGridRowValue {
  Id: string;
  Observer: Observer,
  Shipment: (IOutgoingShipmentAddDetail & OutgoingUpdateRow);
}
export type QuantityCellValueChangeEvent = CaretSizeCellValueChangeEvemt<IOutogingGridRowValue,GridContext>;

export type ValueGetterParams = GridParams.GridGetterParams<IOutogingGridRowValue, GridContext>;
export type ValueSetterParams<V> = GridParams.GridSetterParams<V, IOutogingGridRowValue, GridContext>;
export type CellRendererParams<V> = GridParams.GridRendererParams<V, IOutogingGridRowValue, GridContext>;
export type EditableCallbackParams = GridParams.GridEditableCallbackParams<IOutogingGridRowValue>;
export type CellEditorParams<V> = GridParams.GridEditorParams<C, IOutogingGridRowValue, GridContext>;
export type CellValueChangedEvent<V> = GridParams.GridCellValueChangeEvent<V,IOutogingGridRowValue,GridContext>;