import Observer from '../../Utilities/Observer';
import * as GridParams from './../../Components/AgGridComponent/Grid';
import { CustomPrice, IOutgoingShipmentAddDetail, IOutgoingShipmentUpdateDetail } from './../../Types/DTO';
import { CaretSizeValue } from 'Components/AgGridComponent/Editors/CaretSizeEditor';

type GridContext = {
  getProductDefaultPrice(Id: number): number;
}
export type CustomPriceRowData = GridParams.ValidationRowData<Omit<CustomPrice, 'Quantity'> & { Quantity: CaretSizeValue }>;

type OutgoingUpdateRow = (Omit<IOutgoingShipmentUpdateDetail, 'CustomPrices'| 'TotalQuantityShiped'| 'TotalQuantityRejected'| 'TotalQuantitySale'>
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

export type ValueGetterParams = GridParams.GridGetterParams<IOutogingGridRowValue, GridContext>;
export type ValueSetterParams<V> = GridParams.GridSetterParams<V, IOutogingGridRowValue, GridContext>;
export type CellRendererParams<V> = GridParams.GridRendererParams<V, IOutogingGridRowValue, GridContext>;
export type EditableCallbackParams = GridParams.GridEditableCallbackParams<IOutogingGridRowValue>;
export type CellEditorParams<V> = GridParams.GridEditorParams<C, OutgoingUpdateRow, GridContext>;