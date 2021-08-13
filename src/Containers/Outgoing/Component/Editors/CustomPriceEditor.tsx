import { ColDef, ColumnApi, GridApi, GridOptions, GridParams, GridReadyEvent, ICellEditor } from "@ag-grid-community/all-modules"
import { forwardRef, useImperativeHandle, useEffect, useState } from "react"
import { CellEditorParams, CustomPriceRowData, OutgoingUpdateRow } from './../../OutgoingGrid.d';
import { GridCellValueChangeEvent, GridEditorParams, GridGetterParams, GridRendererParams, GridRowDataTransaction, GridSetterParams } from 'Components/AgGridComponent/Grid.d';
import CaretSizeRenderer from "Components/AgGridComponent/Renderer/CaretSizeRenderer";
import { AgGridReact } from "@ag-grid-community/react";
import NumericOnlyEditor from "./NumericOnlyEditor";
import ActionCellRenderer, { ActionCellParams } from "Components/AgGridComponent/Renderer/ActionCellRender";
import { getARandomNumber } from "Utilities/Utilities";
import { Product } from 'Types/DTO'
import { CaretSizeEditor, CaretSizeEditorValueSetterParams, CaretSizeValue } from "Components/AgGridComponent/Editors/CaretSizeEditor";
import QuantityMediator, { IQuantityMediator } from "Utilities/QuantityMediator";

export default forwardRef<ICellEditor, CellEditorParams<OutgoingUpdateRow['CustomPrices']>>((params, ref) => {
    const [data, setData] = useState<CustomPriceRowData[]>(params.data.CustomPrices || []);
    const isProductIdValid = params.data.ProductId !== -1;
    const defaultPrice = isProductIdValid ? params.context.getProductDefaultPrice(params.data.ProductId) : 0;

    useImperativeHandle(ref, () => ({
        getValue() {
            return data;
        },
        isCancelBeforeStart() {
            return !isProductIdValid && params.data.TotalQuantitySale > 0;
        }
    }));
    return <CustomPriceGrid initialData={{ CaretSize: params.data.CaretSize, Data: data, DefaultPrice: defaultPrice, QuantityLimit: params.data.TotalQuantitySale }} setData={setData} />
});

type GridData = {
    CaretSize: number;
    Data: CustomPriceRowData[];
    DefaultPrice: number;
    QuantityLimit: number;
}
type CustomPriceProps = {
    setData: (data: CustomPriceRowData[]) => void;
    initialData: GridData;
}
type PriceGridContext = {
    getCaretSize: () => number;
};
type CustomPriceGridEditorParams<V> = GridEditorParams<V, CustomPriceRowData, PriceGridContext>;
type CustomPriceGridCellRendererParams<V> = GridRendererParams<V, CustomPriceRowData, PriceGridContext>;
type CustomPriceGridValueGetterParams = GridGetterParams<CustomPriceRowData, PriceGridContext>;
type CustomPriceValueSetterParams<V> = GridSetterParams<V, CustomPriceRowData, PriceGridContext>;

const defaultColDef: ColDef = {
    flex: 1,
    editable: true
}

const quantityGetter = (params: CustomPriceGridValueGetterParams) => {
    const quantity: CaretSizeValue = { Value: params.data.Quantity.Value.Value };

};

const quantitySetter = (params: CaretSizeEditorValueSetterParams<CustomPriceValueSetterParams<CustomPriceRowData['Quantity']['Value']>>) => {
    params.data.Quantity = { IsValid: params.newValue.IsValid, Value: { ...params.oldValue, Value: params.newValue.Value } };
    return true;
}
const colDefs: ColDef[] = [
    {
        headerName: 'S.No',
        valueGetter: (params: CustomPriceGridValueGetterParams) => params.node!.rowIndex! + 1,
        editable: false
    },
    {
        headerName: 'Quantity',
        valueGetter: quantityGetter,
        valueSetter: quantitySetter,
        cellEditorFramework: CaretSizeEditor<CustomPriceGridEditorParams<CustomPriceRowData['Quantity']['Value']>>(e => e.context.getCaretSize(), (e) => true),
        cellRendererFramework: CaretSizeRenderer<CustomPriceGridCellRendererParams<CustomPriceRowData['Quantity']>>(e => e.context.getCaretSize())
    },
    {
        headerName: 'Price',
        valueGetter: (params: CustomPriceGridValueGetterParams) => params.data.Price.Value,
        cellEditorFramework: NumericOnlyEditor
    }
];
type PriceGridCellValueChangedEvent = GridCellValueChangeEvent<any, CustomPriceRowData, PriceGridContext>;
type RowTransactionData = GridRowDataTransaction<CustomPriceRowData>;
const CustomPriceGrid = function (props: CustomPriceProps) {
    const [list, setList] = useState<CustomPriceRowData[]>(props.initialData.Data);
    const [api, setApi] = useState<GridApi>();
    const [columnApi, setColumnApi] = useState<ColumnApi>();
    const [quantityMediator] = useState<IQuantityMediator>(new QuantityMediator([({ CaretSize: 12, Id: 1, Flavours: [{ Id: 1, Title: '', Quantity: props.initialData.QuantityLimit }] } as Product)]))

    const addAPrice = () => {
        const leftQuantity = quantityMediator.GetQuantityLimit(1, 1);
        if (leftQuantity > 0) {
            const data: CustomPriceRowData[] = []
            api?.forEachNode(e => data.push(e.data));
         
            const newPrice: CustomPriceRowData = {
                Id: { IsValid: true, Value: getARandomNumber(data.map(e => ({ 'Id': e.Id.Value }))) },
                Price: { IsValid: true, Value: props.initialData.DefaultPrice },
                Quantity: { IsValid: false, Value: { Value: 0,MaxLimit:leftQuantity} }
            };
            const transaction: RowTransactionData = {
                add: [newPrice]
            }
            api?.applyTransaction(transaction);
        }
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