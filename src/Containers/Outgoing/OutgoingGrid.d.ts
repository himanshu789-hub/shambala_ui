import Observer from '../../Utilities/Observer';
import * as GridParams from './../../Components/AgGridComponent/Grid';
import { CustomPrice, IOutgoingShipmentAddDetail, IOutgoingShipmentUpdateDetail } from './../../Types/DTO';


type GridContext = {
  getProductDefaultPrice(Id:number):number;
}
export type CustomPriceRowData = GridParams.ValidationRowData<CustomPrice>;

type OutgoingUpdateRow = (Omit<IOutgoingShipmentUpdateDetail, 'CustomPrices'> & { CustomPrices: CustomPriceRowData[] })

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