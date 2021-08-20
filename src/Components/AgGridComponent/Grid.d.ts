import { CellClassParams, EditableCallbackParams, CellValueChangedEvent, ICellEditorParams, ICellRendererParams, ITooltipParams, RowDataTransaction, ValueGetterParams, ValueSetterParams } from "@ag-grid-community/all-modules";

type GridParamsWithContext<T, CTx> = Omit<T, 'context'> & {
      context: CTx
}
type GridParamsWithData<T, DataT> = Omit<T, 'data'> & { data: DataT }
type GridParamsWithValue<V, T, DataT> = Omit<GridParamsWithData<T, DataT>, 'value'> & {
      value: V;
}
type GridWithOldAndNewValue<T, VType> = Omit<T, "oldValue" | "newValue"> & {
      oldValue: VType,
      newValue: VType
}

type GridRowNode = GridParamsWithData<RowNode, IRowValue>;

export type GridEditableCallbackParams<DataT> = GridParamsWithData<EditableCallbackParams, DataT>;
export type GridCellClassParams<DataT> = GridParamsWithData<CellClassParams, DataT>;
export type GridToolTipParams<DataT> = GridParamsWithValue<string, ITooltipParams, DataT>;

export type GridEditorParams<ValueType, DataT, CtxT> = GridParamsWithContext<GridParamsWithValue<ValueType, ICellEditorParams, DataT>, CtxT>;
export type GridRendererParams<ValueType, DataT, CtxT> = GridParamsWithContext<GridParamsWithValue<ValueType, ICellRendererParams, DataT>, CtxT>;

export type GridSetterParams<VType, DataT, CtxT> = GridWithOldAndNewValue<GridParamsWithContext<GridParamsWithData<ValueSetterParams, DataT>, CtxT>
,VType>

export type GridGetterParams<DataT, CtxT> = GridParamsWithContext<GridParamsWithData<ValueGetterParams, DataT>, CtxT>;

type Ids = { Id: string };
export type GridRowDataTransaction<DataT> = Omit<{ [Property in keyof RowDataTransaction]+?: DataT[] }, 'addIndex' | 'remove'> & {
      addIndex?: (number | null),
      remove?: Ids[]
};
export type GridCellValueChangeEvent<V, DataT, CtxT> = GridWithOldAndNewValue<GridParamsWithContext<GridParamsWithData<CellValueChangedEvent, DataT>, CtxT>, V>;
export type GridValueParserParams<V,DataT,CtxT> = GridParamsWithContext<GridParamsWithData<GridWithOldAndNewValue<ValueSetterParams,V>,DataT>,CTxT>;
export type ValidationRowData<T> = { [Property in keyof T]: { Value: T[Property], IsValid: boolean } };