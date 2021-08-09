import  Observer  from '../../Utilities/Observer';
import * as GridParams from './../../Components/AgGridComponent/Grid';
import { IOutgoingShipmentAddDetail, IOutgoingShipmentUpdateDetail } from './../../Types/DTO';


type GridContext  = {

}
interface IOutogingGridRowValue {
    Id: string;
    Observer: Observer,
    Shipment: (IOutgoingShipmentAddDetail & IOutgoingShipmentUpdateDetail);
}
export type ValueGetterParams = GridParams.GridGetterParams<IOutogingGridRowValue,GridContext>;
export type ValueSetterParams<V> = GridParams.GridSetterParams<V,IOutogingGridRowValue,GridContext>;
export type CellRendererParams<V> = GridParams.GridRendererParams<V,IOutogingGridRowValue,GridContext>;
export type EditableCallbackParams = GridParams.GridEditableCallbackParams<IOutogingGridRowValue>;
export type CellEditorParams<V> = GridParams.GridEditorParams<C,IOutgoingShipmentUpdateDetail,GridContext>;