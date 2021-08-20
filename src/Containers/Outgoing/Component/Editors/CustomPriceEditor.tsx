import { ColDef, ColumnApi, GridApi, GridOptions, GridReadyEvent, ICellEditor } from "@ag-grid-community/all-modules"
import { forwardRef, useImperativeHandle, useEffect, useState } from "react"
import { CellEditorParams, CustomPriceRowData, OutgoingUpdateRow } from './../../OutgoingGrid.d';
import { GridCellValueChangeEvent, GridEditorParams, GridGetterParams, GridRendererParams, GridRowDataTransaction, GridSetterParams, GridValueParserParams } from 'Components/AgGridComponent/Grid.d';
import CaretSizeRenderer from "Components/AgGridComponent/Renderer/CaretSizeRenderer";
import { AgGridReact } from "@ag-grid-community/react";
import NumericOnlyEditor from "./NumericOnlyEditor";
import ActionCellRenderer, { ActionCellParams } from "Components/AgGridComponent/Renderer/ActionCellRender";
import { getARandomNumber } from "Utilities/Utilities";
import { CaretSizeEditor, CaretSizeNewValue, CaretSizeValue } from "Components/AgGridComponent/Editors/CaretSizeEditor";
import QuantityMediatorWrapper, { IQuantityMediatorWrapper } from './QuatityMediatorWrapper';
import { addWarn } from "Utilities/AlertUtility";

export default forwardRef<ICellEditor, CellEditorParams<OutgoingUpdateRow['CustomPrices']>>((params, ref) => {
    const [data, setData] = useState<CustomPriceRowData[]>(params.data.Shipment.CustomPrices || []);
    const isProductIdValid = params.data.Shipment.ProductId !== -1;
    const defaultPrice: number = isProductIdValid ? params.context.getProductDetails(params.data.Shipment.ProductId).Price : 0;

    useImperativeHandle(ref, () => ({
        getValue() {
            return data;
        },
        isCancelBeforeStart() {
            return !isProductIdValid && params.data.Shipment.TotalQuantitySale > 0;
        }
    }));
    return <CustomPriceGrid initialData={{ CaretSize: params.data.Shipment.CaretSize, Data: data, DefaultPrice: defaultPrice, QuantityLimit: params.data.Shipment.TotalQuantitySale }} setData={setData} />
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
    getQuantityMediator(): IQuantityMediatorWrapper;
};
type CustomPriceGridEditorParams<V> = GridEditorParams<V, CustomPriceRowData, PriceGridContext>;
type CustomPriceGridCellRendererParams<V> = GridRendererParams<V, CustomPriceRowData, PriceGridContext>;
type CustomPriceGridValueGetterParams = GridGetterParams<CustomPriceRowData, PriceGridContext>;
type CustomPriceValueSetterParams<V> = GridSetterParams<V, CustomPriceRowData, PriceGridContext>;
type CustomPriceValueParser<V> = GridValueParserParams<V, CustomPriceRowData, PriceGridContext>;

const defaultColDef: ColDef = {
    flex: 1,
    editable: true
}

const quantityGetter = (params: CustomPriceGridValueGetterParams) => {
    const quantityMediator = params.context.getQuantityMediator();
    const quantitySizeValue = params.data.Quantity.Value;
    let previousMaxLimit = quantitySizeValue.MaxLimit;
    const quantityLeft = quantityMediator.GetQuantityLimit();
    const validQuantityLimit = quantityLeft > 0 ? quantityLeft : 0;
    if (quantityMediator.IsQuantitySubscribed(params.data.Id.Value)) {
        previousMaxLimit = (previousMaxLimit ? previousMaxLimit : 0) + validQuantityLimit;
    }
    const quantity: CaretSizeValue = { ...params.data.Quantity.Value, MaxLimit: validQuantityLimit };
    return quantity;
};

const quantitySetter = (params: CustomPriceValueSetterParams<CustomPriceRowData['Quantity']>) => {
    params.data.Quantity = params.newValue;
    return true;
}

type PriceGridCellValueChangedEvent = GridCellValueChangeEvent<any, CustomPriceRowData, PriceGridContext>;
type RowTransactionData = GridRowDataTransaction<CustomPriceRowData>;
const CustomPriceGrid = function (props: CustomPriceProps) {
    const [list, setList] = useState<CustomPriceRowData[]>(props.initialData.Data);
    const [api, setApi] = useState<GridApi>();
    const [columnApi, setColumnApi] = useState<ColumnApi>();
    const [quantityMediator] = useState<IQuantityMediatorWrapper>(new QuantityMediatorWrapper(props.initialData.QuantityLimit));

    const addAPrice = () => {
        const leftQuantity = quantityMediator.GetQuantityLimit();

        if (leftQuantity > 0) {
            const data: CustomPriceRowData[] = []
            api?.forEachNode(e => data.push(e.data));
            if (data.find(e => e.Quantity.Value.Value === 0) === null) {
                const newPrice: CustomPriceRowData = {
                    Id: { IsValid: true, Value: getARandomNumber() },
                    Price: { IsValid: true, Value: props.initialData.DefaultPrice },
                    Quantity: { IsValid: false, Value: { Value: 0, MaxLimit: leftQuantity } }
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
                valueGetter: quantityGetter,
                valueSetter: quantitySetter,
                valueParser: function (params: CustomPriceValueParser<CaretSizeNewValue>) {
                    const { newValue: { Value, IsValid } } = params;
                    return { Value: IsValid ? Value : 0 } as CaretSizeValue;
                },
                cellEditorFramework: CaretSizeEditor<CustomPriceGridEditorParams<CustomPriceRowData['Quantity']['Value']>>(e => e.context.getCaretSize(), (e) => true),
                cellRendererFramework: CaretSizeRenderer<CustomPriceGridCellRendererParams<CustomPriceRowData['Quantity']>>(e => e.context.getCaretSize(), e => e.value.Value.Value)
            },
            {
                headerName: 'Price',
                valueGetter: (params: CustomPriceGridValueGetterParams) => params.data.Price.Value,
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