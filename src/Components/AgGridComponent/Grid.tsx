import Observer from "Utilities/Observer";
import { ShipmentDTO } from 'Types/DTO';
import { ICellEditorParams, ICellRendererParams, ValueGetterParams, ValueSetterParams, RowDataTransaction } from "@ag-grid-community/all-modules";
export type IRowValue = {
      Shipment: ShipmentDTO;
      Observer: Observer;
      MaxLimit?: number;
      MinLimit?: number;
}

type GridParamsWithData<T> = Omit<T, 'data'> & { data: IRowValue }
type GridParams<ValueType, T> = GridParamsWithData<T> & {
      value: ValueType;
}
export type GridEditorParams<ValueType> = GridParams<ValueType, ICellEditorParams>;
export type GridRendererParams<ValueType> = GridParams<ValueType, ICellRendererParams>;
export type GridSetterParams<ValueType> = Omit<GridParamsWithData<ValueSetterParams>, 'oldValue' | 'newValue'> & {
      oldValue: ValueType,
      newValue: ValueType
}
export type GridGetterParams = GridParamsWithData<ValueGetterParams>;
export type GridRowDataTransaction = Omit<{ [Property in keyof RowDataTransaction]+?: IRowValue[] }, 'addIndex' | 'remove'> & {
      addIndex?: (number | null),
      remove?: { Id:number }[]
};