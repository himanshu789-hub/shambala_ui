import { ColDef, ColumnApi, GridApi, GridOptions, GridReadyEvent, ICellEditor } from "@ag-grid-community/all-modules"
import { forwardRef, useImperativeHandle, useEffect, useState } from "react"
import { CellEditorParams, CustomPriceRowData, OutgoingUpdateRow } from './../../OutgoingGrid.d';
import { GridCellValueChangeEvent, GridEditorParams, GridGetterParams, GridRendererParams, GridRowDataTransaction, GridSetterParams, GridValueParserParams } from 'Components/AgGridComponent/Grid.d';
import CaretSizeRenderer from "Components/AgGridComponent/Renderer/CaretSizeRenderer";
import { AgGridReact } from "@ag-grid-community/react";
import NumericOnlyEditor from "./NumericOnlyEditor";
import ActionCellRenderer, { ActionCellParams } from "Components/AgGridComponent/Renderer/ActionCellRender";
import { getARandomNumber } from "Utilities/Utilities";
import { CaretSizeEditor, CaretSizeValue, CaretSizeValueOldAndNewValue } from "Components/AgGridComponent/Editors/CaretSizeEditor";
import QuantityMediatorWrapper, { IQuantityMediatorWrapper } from '../../../../Utilities/QuatityMediatorWrapper';
import { addWarn } from "Utilities/AlertUtility";
import { CustomPrice } from "Types/DTO";

export default forwardRef<ICellEditor, CellEditorParams<OutgoingUpdateRow['CustomPrices']>>((params, ref) => {
    const [data, setData] = useState<CustomPrice[]>(params.data.Shipment.CustomPrices || []);
    const isProductIdValid = params.data.Shipment.ProductId !== -1;
    const defaultPrice: number = isProductIdValid ? params.context.getProductDetails(params.data.Shipment.ProductId).Price : 0;

    useImperativeHandle(ref, () => ({
        getValue() {
            return data;
        },
        isCancelBeforeStart() {
            return !isProductIdValid && params.data.Shipment.TotalQuantityShiped > 0;
        },
        isPopup() {
            return true;
        }
    }));
    return <CustomPriceGrid initialData={{ CaretSize: params.data.Shipment.CaretSize, Data: data, DefaultPrice: defaultPrice, QuantityLimit: params.data.Shipment.TotalQuantityShiped }} setData={setData} />
});

type GridData = {
    CaretSize: number;
    Data: CustomPrice[];
    DefaultPrice: number;
    QuantityLimit: number;
}
type CustomPriceProps = {
    setData: (data: CustomPrice[]) => void;
    initialData: GridData;
}
type PriceGridContext = {
    getCaretSize: () => number;
    getQuantityMediator(): IQuantityMediatorWrapper;
};
type CustomPriceGridEditorParams<V> = GridEditorParams<V, CustomPriceRowData, PriceGridContext>;
type CustomPriceGridCellRendererParams<V> = GridRendererParams<V, CustomPriceRowData, PriceGridContext>;
type CustomPriceGridValueGetterParams = GridGetterParams<CustomPriceRowData, PriceGridContext>;
type CustomPriceCellValueChnageEvent<V> = GridCellValueChangeEvent<V, CustomPrice, PriceGridContext>;
type CustomPriceValueSetterPrams<V> = GridSetterParams<V, CustomPrice, PriceGridContext>;
const defaultColDef: ColDef = {
    flex: 1,
    editable: true
}


type RowTransactionData = GridRowDataTransaction<CustomPriceRowData>;
const CustomPriceGrid = function (props: CustomPriceProps) {
    const [list, setList] = useState<CustomPrice[]>(props.initialData.Data);
    const [api, setApi] = useState<GridApi>();
    const [columnApi, setColumnApi] = useState<ColumnApi>();
    const [quantityMediator] = useState<IQuantityMediatorWrapper>(new QuantityMediatorWrapper(props.initialData.QuantityLimit));

    const addAPrice = () => {
        const leftQuantity = quantityMediator.GetQuantityLimit();

        if (leftQuantity > 0) {
            const data: CustomPriceRowData[] = []
            api?.forEachNode(e => data.push(e.data));
            if (data.find(e => e.Quantity === 0) === null) {
                const newPrice: CustomPriceRowData = {
                    Id: getARandomNumber(),
                    Price: props.initialData.DefaultPrice,
                    Quantity: 0
                };
                const transaction: RowTransactionData = {
                    add: [newPrice]
                }
                api?.applyTransaction(transaction);
            }
            else
                addWarn('Please, Fill Any Empty Row');
        }
    }

    const deleteAChild = (Id: number) => {
        quantityMediator.Unsubscribe(Id);
        const transaction: RowTransactionData = {
            remove: [{ Id: Id + '' }]
        }
        api?.applyTransaction(transaction);
    };

    const [options] = useState<GridOptions>({
        columnDefs: [
            {
                headerName: 'S.No',
                valueGetter: (params: CustomPriceGridValueGetterParams) => params.node!.rowIndex! + 1,
                editable: false
            },
            {
                headerName: 'Quantity',
                cellEditorFramework: CaretSizeEditor<CustomPriceGridEditorParams<CustomPrice['Quantity']>>(e => e.context.getCaretSize(), (e) => true),
                cellRendererFramework: CaretSizeRenderer<CustomPriceGridCellRendererParams<CustomPriceRowData['Quantity']>>(e => e.context.getCaretSize(), (e) => {
                    const quantityMediator = e.context.getQuantityMediator();
                    if (quantityMediator.IsQuantitySubscribed(e.data.Id)) {
                        quantityMediator.Unsubscribe(e.data.Id);
                    }
                    return quantityMediator.GetQuantityLimit();
                }),
                valueSetter: function (params: CaretSizeValueOldAndNewValue<CustomPriceValueSetterPrams<number>>) {
                    params.data.Quantity = params.newValue.IsValid ? params.newValue.Value : params.oldValue;
                    const quantityMediator = params.context.getQuantityMediator();
                    quantityMediator.Subscribe(params.data.Id, params.data.Quantity);
                    return true;
                },
                onCellValueChanged: function (params: CustomPriceCellValueChnageEvent<number>) {
                    const quantityMediator = params.context.getQuantityMediator();
                    quantityMediator.Subscribe(params.data.Id, params.newValue);
                }
            },
            {
                headerName: 'Price',
                cellEditorFramework: NumericOnlyEditor
            },
            {
                headerName: "Action",
                cellRendererFramework: ActionCellRenderer,
                cellRendererParams: {
                    addAChild: addAPrice,
                    deleteAChild: deleteAChild
                } as ActionCellParams<number>
            }],
        getRowNodeId: (data: CustomPriceRowData) => data.Id + '',
        context: {
            getCaretSize: () => props.initialData.CaretSize,
            getQuantityMediator: function () { return quantityMediator; }
        } as PriceGridContext,
        rowData: props.initialData.Data,
        // onCellValueChanged: (event: PriceGridCellValueChangedEvent) => {
        //     setList(list.map((e, index) => index === event.rowIndex ? { ...event.data } : e));
        // },
        defaultColDef: defaultColDef
    });

    const onGridReady = function (params: GridReadyEvent) {
        setApi(params.api);
        setColumnApi(params.columnApi);
        list.length === 0 && addAPrice();
    }

    return (<div className="ag-theme-alpine" style={{ minHeight: 120, minWidth: 190 }}>
        <AgGridReact gridOptions={options} onGridReady={onGridReady} api={api} columnApi={columnApi} rowData={list}>
        </AgGridReact>
    </div>);
}