import { CellValueChangedEvent, ColDef, ColumnApi, GridApi, GridOptions, GridReadyEvent, ICellEditor } from "@ag-grid-community/all-modules"
import { useState } from "react";
import { useEffect } from "react";
import { forwardRef, useImperativeHandle } from "react"
import { CustomPrice, IOutgoingShipmentUpdateDetail } from "Types/DTO";
import { CellEditorParams } from './../../OutgoingGrid.d';
import { GridCellValueChangeEvent, GridGetterParams, GridRendererParams } from 'Components/AgGridComponent/Grid.d';
import CaretSizeRenderer from "Components/AgGridComponent/Renderer/CaretSizeRenderer";
import { AgGridReact } from "@ag-grid-community/react";
import NumericOnlyEditor from "./NumericOnlyEditor";
import ActionCellRenderer, { ActionCellParams } from "Components/AgGridComponent/Renderer/ActionCellRender";
import { getARandomNumber } from "Utilities/Utilities";

export default forwardRef<ICellEditor, CellEditorParams<IOutgoingShipmentUpdateDetail['CustomPrices']>>((params, ref) => {
    const [data, setData] = useState<CustomPrice[]>(params.data.CustomPrices || []);
    useImperativeHandle(ref, () => ({
        getValue() {
            return data;
        },
        isCancelBeforeStart() {
            return params.data.ProductId === -1;
        }
    }));
    return <CustomPriceGrid initialData={{ CaretSize: params.data.CaretSize, Data: data }} setData={setData} />
});

type GridData = {
    CaretSize: number;
    Data: CustomPrice[];
}
type CustomPriceProps = {
    setData: (data: CustomPrice[]) => void;
    initialData: GridData;
}
type PriceGridContext = {
    getCaretSize: () => number;
};
type PriceGridCelLRendererParams<V> = GridRendererParams<V, CustomPrice, PriceGridContext>;
type PriceGridValueGetterParams = GridGetterParams<CustomPrice, PriceGridContext>;
const defaultColDef: ColDef = {
    flex: 1,
    editable: true
}
const colDefs: ColDef[] = [
    {
        headerName: 'S.No',
        valueGetter: (params: PriceGridValueGetterParams) => params.node!.rowIndex! + 1,
        editable: false
    },
    {
        headerName: 'Quantity',
        field: 'Quantity',
        cellRendererFramework: CaretSizeRenderer<PriceGridCelLRendererParams<CustomPrice['Quantity']>>(e => e.context.getCaretSize())
    },
    {
        headerName: 'Price',
        field: 'Price',
        cellEditorFramework: NumericOnlyEditor
    }
];
type PriceGridCellValueChangedEvent = GridCellValueChangeEvent<any, CustomPrice, PriceGridContext>;

const CustomPriceGrid = function (props: CustomPriceProps) {
    const [list, setList] = useState<CustomPrice[]>(props.initialData.Data);
    const [api, setApi] = useState<GridApi>();
    const [columnApi, setColumnApi] = useState<ColumnApi>();

    const addAPrice = () => {
        const data: CustomPrice[] = []
        api?.forEachNode(e => data.push(e.data));
        const newPrice: CustomPrice = { Id: getARandomNumber(data), Price: 0, Quantity: 0 };
        api?.applyTransaction({ add: [newPrice] })
    }
    const deleteAChild = (Id: number) => {
        api?.applyTransaction({ remove: [{ Id }] });
    }
    const [options] = useState<GridOptions>({
        columnDefs: [...colDefs, {
            headerName: "Action",
            cellRendererFramework: ActionCellRenderer,
            cellRendererParams: {
                addAChild: addAPrice,
                deleteAChild:deleteAChild
            } as ActionCellParams<number>
        }],
        getRowNodeId: (data) => data.Id,
        context: {
            getCaretSize: () => props.initialData.CaretSize
        } as PriceGridContext,
        rowData: props.initialData.Data,
        onCellValueChanged: (event: PriceGridCellValueChangedEvent) => {
            setList(list.map((e, index) => index === event.rowIndex ? { ...event.data } : e));
        }
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