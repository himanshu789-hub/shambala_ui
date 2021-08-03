import Observer from "Utilities/Observer";
import { ShipmentDTO } from 'Types/DTO';
import { ICellEditorParams, ICellRendererParams, ValueGetterParams, ValueSetterParams, RowDataTransaction, CellValueChangedEvent, RowNode } from "@ag-grid-community/all-modules";
export type IRowValue = {
      Shipment: ShipmentDTO;
      Observer: Observer;
      MaxLimit?: number;
      MinLimit?: number;
}
type GridParamsWithContext<T> = Omit<T, 'context'> & {
      context: GridContext
}
type GridParamsWithData<T> = Omit<T, 'data'> & { data: IRowValue }
type GridParamsWithValue<ValueType, T> = GridParamsWithData<T> & {
      value: ValueType;
}
type GridWithOldAndNewValue<T, ValueType> = Omit<T, 'oldValue' | 'newValue'> & {
      oldValue: ValueType,
      newValue: ValueType
}

export type GridEditorParams<ValueType> = GridParamsWithContext<GridParamsWithValue<ValueType, ICellEditorParams>>;
export type GridRendererParams<ValueType> = GridParamsWithContext<GridParamsWithValue<ValueType, ICellRendererParams>>;

export type GridSetterParams<ValueType> = GridWithOldAndNewValue<GridParamsWithContext<GridParamsWithData<ValueSetterParams>>,ValueType>

export type GridGetterParams = GridParamsWithContext<GridParamsWithData<ValueGetterParams>>;

export type GridRowDataTransaction = Omit<{ [Property in keyof RowDataTransaction]+?: IRowValue[] }, 'addIndex' | 'remove'> & {
      addIndex?: (number | null),
      remove?: { Id: number }[]
};
export type GridCellValueChangeEvent<V> = GridWithOldAndNewValue<GridParamsWithContext<GridParamsWithData<CellValueChangedEvent>>,V>;

export type GridContext = {
      getCartetSizeByProductId(Id: number): number;
      getColumnIndex(name: keyof ShipmentDTO): number | null;
}
export type GridRowNode = GridParamsWithData<RowNode>;