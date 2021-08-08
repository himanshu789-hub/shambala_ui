import { CellClassParams,EditableCallbackParams, CellValueChangedEvent, ICellEditorParams, ICellRendererParams, ITooltipParams, RowDataTransaction, ValueGetterParams, ValueSetterParams } from "@ag-grid-community/all-modules";

type GridParamsWithContext<T, ContextType> = Omit<T, 'context'> & {
      context: ContextType
}
type GridParamsWithData<T, DataType> = Omit<T, 'data'> & { data: DataType }
type GridParamsWithValue<ValueType, T, DataType> = Omit<GridParamsWithData<T, DataType>, 'value'> & {
      value: ValueType;
}
type GridWithOldAndNewValue<T, ValueType> = Omit<T, 'oldValue' | 'newValue'> & {
      oldValue: ValueType,
      newValue: ValueType
}

type GridRowNode = GridParamsWithData<RowNode, IRowValue>;

export type GridEditableCallbackParams<DataT> = GridParamsWithData<EditableCallbackParams,DataT>;
export type GridCellStyleParams<Datatype> = GridParamsWithData<CellClassParams, DataType>;
export type GridToolTipParams<DataType> = GridParamsWithValue<string, ITooltipParams,DataType>;

export type GridEditorParams<ValueType,DataT,CtxT> = GridParamsWithContext<GridParamsWithValue<ValueType, ICellEditorParams, DataT>, CtxT>;
export type GridRendererParams<ValueType,DataT,CtxT> = GridParamsWithContext<GridParamsWithValue<ValueType, ICellRendererParams, DataT>,CtxT>;

export type GridSetterParams<ValueType,DataT,CtxT> = GridWithOldAndNewValue<GridParamsWithContext<GridParamsWithData<ValueSetterParams, DataT>, CtxT>, ValueType>

export type GridGetterParams<DataT,CtxT> = GridParamsWithContext<GridParamsWithData<ValueGetterParams, DataT>, CtxT>;

type Ids = { Id: string };
export type GridRowDataTransaction<DataT> = Omit<{ [Property in keyof RowDataTransaction]+?: DataT[] }, 'addIndex' | 'remove'> & {
      addIndex?: (number | null),
      remove?: Ids[]
};
export type GridCellValueChangeEvent<V,DataT,CtxT> = GridWithOldAndNewValue<GridParamsWithContext<GridParamsWithData<CellValueChangedEvent, DataT>, CtxT>, V>;

