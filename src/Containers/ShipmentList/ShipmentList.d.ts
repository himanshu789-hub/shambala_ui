import { GridParamsWithContext, GridParamsWithData, GridParamsWithValue, GridWithOldAndNewValue, GridRowNode, GridRowDataTransaction, GridGetterParams, GridEditorParams, GridSetterParams, GridRendererParams, GridCellValueChangeEvent, GridToolTipParams, GridCellClassParams } from './../../Components/AgGridComponent/Grid.d';
import Observer from "./../../Utilities/Observer";
import { ShipmentDTO } from './../../Types/DTO';
import { ICellEditorParams, ICellRendererParams, ValueGetterParams, ValueSetterParams, RowDataTransaction, CellValueChangedEvent, RowNode, IToolPanelParams, ITooltipParams, CellClassParams } from "@ag-grid-community/all-modules";
import { CaretSizeValue } from 'Components/AgGridComponent/Editors/CaretSizeEditor';

type GridContext = {
    getCartetSizeByProductId(Id: number): number;
    getColumnIndex(name: keyof ShipmentDTO): number | null;
    ShouldLimitQuantity:boolean;
}
type ShipmentRowValue = ShipmentDTO; 
type IRowValue = {
    Id: string;
    Shipment: ShipmentRowValue;
    Observer: Observer;
}
type ShipmentGridRowNode = GridRowNode<IRowValue>;
type ShipmentGridDataTransation = GridRowDataTransaction<IRowValue>;
type ShipmentGridGetterParams = GridGetterParams<IRowValue, GridContext>;
type ShipmentGridEditorParams<V> = GridEditorParams<V, IRowValue, GridContext>;
type ShipmentGridSetter<V> = GridSetterParams<V, IRowValue, GridContext>;
type ShipmentRendererParams<V> = GridRendererParams<V, IRowValue, GridContext>;
type QuantityCellValueChangeEvent = GridCellValueChangeEvent<CaretSizeValue, IRowValue, GridContext>;
type ShipmentCellValueChangeEvent<V> = GridCellValueChangeEvent<V, IRowValue, GridContext>;
type ShipmentValueSetter<V> = GridSetterParams<V, IRowValue, GridContext>;
type ToolTipRendererParams = GridToolTipParams<IRowValue>;
type CellClassParams = GridCellClassParams<IRowValue,GridContext>;

