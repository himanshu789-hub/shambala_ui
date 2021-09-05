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

type GridEditableCallbackParams<DataT> = GridParamsWithData<EditableCallbackParams, DataT>;
type GridCellClassParams<DataT> = GridParamsWithData<CellClassParams, DataT>;
type GridToolTipParams<DataT> = GridParamsWithValue<string, ITooltipParams, DataT>;

type GridEditorParams<ValueType, DataT, CtxT> = GridParamsWithContext<GridParamsWithValue<ValueType, ICellEditorParams, DataT>, CtxT>;
type GridRendererParams<ValueType, DataT, CtxT> = GridParamsWithContext<GridParamsWithValue<ValueType, ICellRendererParams, DataT>, CtxT>;

type GridSetterParams<VType, DataT, CtxT> = GridWithOldAndNewValue<GridParamsWithContext<GridParamsWithData<ValueSetterParams, DataT>, CtxT>
      , VType>

type GridGetterParams<DataT, CtxT> = GridParamsWithContext<GridParamsWithData<ValueGetterParams, DataT>, CtxT>;

type Ids = { Id: string };
type GridRowDataTransaction<DataT> = Omit<{ [Property in keyof RowDataTransaction]+?: DataT[] }, 'addIndex' | 'remove'> & {
      addIndex?: (number | null),
      remove?: Ids[]
};
type GridCellValueChangeEvent<V, DataT, CtxT> = GridWithOldAndNewValue<GridParamsWithContext<GridParamsWithData<CellValueChangedEvent, DataT>, CtxT>, V>;
type GridValueParserParams<V, DataT, CtxT> = GridParamsWithContext<GridParamsWithData<GridWithOldAndNewValue<ValueSetterParams, V>, DataT>, CTxT>;
type ValidationRowData<T> = { [Property in keyof T]: { Value: T[Property], IsValid: boolean } };
type RowStyleParams<DataT,Ctx> = GridParamsWithData<GridParamsWithContext<RowClassParams,Ctx>,DataT>;