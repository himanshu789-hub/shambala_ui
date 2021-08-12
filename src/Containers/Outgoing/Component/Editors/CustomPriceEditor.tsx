import { CellValueChangedEvent, ColDef, ColumnApi, GridApi, GridOptions, GridParams, GridReadyEvent, ICellEditor } from "@ag-grid-community/all-modules"
import { forwardRef, useImperativeHandle, useEffect, useState } from "react"
import { CustomPrice, IOutgoingShipmentUpdateDetail } from "Types/DTO";
import { CellEditorParams, CustomPriceRowData, OutgoingUpdateRow } from './../../OutgoingGrid.d';
import { GridCellValueChangeEvent, GridEditorParams, GridGetterParams, GridRendererParams, GridRowDataTransaction } from 'Components/AgGridComponent/Grid.d';
import CaretSizeRenderer from "Components/AgGridComponent/Renderer/CaretSizeRenderer";
import { AgGridReact } from "@ag-grid-community/react";
import NumericOnlyEditor from "./NumericOnlyEditor";
import ActionCellRenderer, { ActionCellParams } from "Components/AgGridComponent/Renderer/ActionCellRender";
import { getARandomNumber } from "Utilities/Utilities";
import { CaretSizeEditor } from "Components/AgGridComponent/Editors/CaretSizeEditor";

export default forwardRef<ICellEditor, CellEditorParams<OutgoingUpdateRow['CustomPrices']>>((params, ref) => {
    const [data, setData] = useState<CustomPriceRowData[]>(params.data.CustomPrices || []);
    const isProductIdValid = params.data.ProductId !== -1;
    const defaultPrice = isProductIdValid ? params.context.getProductDefaultPrice(params.data.ProductId) : 0;
    useImperativeHandle(ref, () => ({
        getValue() {
            return data;
        },
        isCancelBeforeStart() {
            return !isProductIdValid;
        }
    }));
    return <CustomPriceGrid initialData={{ CaretSize: params.data.CaretSize, Data: data, DefaultPrice:defaultPrice }} setData={setData} />
});

type GridData = {
    CaretSize: number;
    Data: CustomPriceRowData[];
    DefaultPrice: number;
}
type CustomPriceProps = {
    setData: (data: CustomPriceRowData[]) => void;
    initialData: GridData;
}
type PriceGridContext = {
    getCaretSize: () => number;
};
type CustomPriceGridEditorParams<V> = GridEditorParams<V,CustomPriceRowData,PriceGridContext>;
type CustomPriceGridCellRendererParams<V> = GridRendererParams<V, CustomPriceRowData, PriceGridContext>;
type CustomPriceGridValueGetterParams = GridGetterParams<CustomPriceRowData, PriceGridContext>;
const defaultColDef: ColDef = {
    flex: 1,
    editable: true
}
const colDefs: ColDef[] = [
    {
        headerName: 'S.No',
        valueGetter: (params: CustomPriceGridValueGetterParams) => params.node!.rowIndex! + 1,
        editable: false
    },
    {
        headerName: 'Quantity',
        field: 'Quantity',
        cellEditorFramework:CaretSizeEditor<CustomPriceGridEditorParams<CustomPriceRowData['Quantity']>,any>(e=>e.context.getCaretSize(),(e)=>true),
        cellRendererFramework: CaretSizeRenderer<CustomPriceGridCellRendererParams<CustomPrice['Quantity']>>(e => e.context.getCaretSize())
    },
    {
        headerName: 'Price',
        field: 'Price',
        cellEditorFramework: NumericOnlyEditor
    }
];
type PriceGridCellValueChangedEvent = GridCellValueChangeEvent<any, CustomPriceRowData, PriceGridContext>;
type RowTransactionData = GridRowDataTransaction<CustomPriceRowData>;
const CustomPriceGrid = function (props: CustomPriceProps) {
    const [list, setList] = useState<CustomPriceRowData[]>(props.initialData.Data);
    const [api, setApi] = useState<GridApi>();
    const [columnApi, setColumnApi] = useState<ColumnApi>();

    const addAPrice = () => {
        const data: CustomPriceRowData[] = []

        api?.forEachNode(e => data.push(e.data));
        const newPrice: CustomPriceRowData = {
            Id: { IsValid: true, Value: getARandomNumber(data.map(e => ({ 'Id': e.Id.Value }))) },
            Price: { IsValid: true, Value: props.initialData.DefaultPrice },
            Quantity: { IsValid: false, Value: 0 }
        };
        const transaction: RowTransactionData = {
            add: [newPrice]
        }
        api?.applyTransaction(transaction);
    }
    const deleteAChild = (Id: number) => {
        const transaction: RowTransactionData = {
            remove: [{ Id: Id + '' }]
        }
        api?.applyTransaction(transaction);
    }
    const [options] = useState<GridOptions>({
        columnDefs: [...colDefs, {
            headerName: "Action",
            cellRendererFramework: ActionCellRenderer,
            cellRendererParams: {
                addAChild: addAPrice,
                deleteAChild: deleteAChild
            } as ActionCellParams<number>
        }],
        getRowNodeId: (data: CustomPriceRowData) => data.Id.Value + '',
        context: {
            getCaretSize: () => props.initialData.CaretSize
        } as PriceGridContext,
        rowData: props.initialData.Data,
        onCellValueChanged: (event: PriceGridCellValueChangedEvent) => {
            setList(list.map((e, index) => index === event.rowIndex ? { ...event.data } : e));
        },
        defaultColDef: defaultColDef
    });

    const onGridReady = function (params: GridReadyEvent) {
        setApi(params.api);
        setColumnApi(params.columnApi)
    }
 
    useEffect(() => {
        props.setData(list);
    }, [list]);

    return (<div className="ag-theme-alpine">
        <AgGridReact gridOptions={options} onGridReady={onGridReady} api={api} columnApi={columnApi} >
        </AgGridReact>
    </div>);
}