import {GridParamsWithContext,GridParamsWithData,GridParamsWithValue,GridWithOldAndNewValue,GridRowNode,GridRowDataTransaction, GridGetterParams, GridEditorParams, GridSetterParams, GridRendererParams, GridCellValueChangeEvent} from './../../Components/AgGridComponent/Grid.d';
import Observer from "./../../Utilities/Observer";
import { ShipmentDTO } from './../../Types/DTO';
import { ICellEditorParams, ICellRendererParams, ValueGetterParams, ValueSetterParams, RowDataTransaction, CellValueChangedEvent, RowNode, IToolPanelParams, ITooltipParams, CellClassParams } from "@ag-grid-community/all-modules";

export type GridContext = {
      getCartetSizeByProductId(Id: number): number;
      getColumnIndex(name: keyof ShipmentDTO): number | null;
}
export type IRowValue = {
    Id:string;
    Shipment: ShipmentDTO;
    Observer: Observer;
    MaxLimit?: number;
    MinLimit?: number;
}
export type ShipmentGridRowNode = GridRowNode<IRowValue>;
export type ShipmentGridDataTransation = GridRowDataTransaction<IRowValue>;
export type ShipmentGridGetterParams = GridGetterParams<IRowValue,GridContext>;
export type ShipmentGridEditorParams<V> = GridEditorParams<V,IRowValue,GridContext>;
export type ShipmentGridSetter<V> = GridSetterParams<V,IRowValue,GridContext>;
export type ShipmentRendererParams<V> = GridRendererParams<V,IRowValue,GridContext>;
export type ShipmentCellValueChangeEvent<V> = GridCellValueChangeEvent<V,IRowValue,GridContext>;