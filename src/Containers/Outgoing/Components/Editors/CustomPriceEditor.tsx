import { ColDef, ColumnApi, GridApi, GridOptions, GridReadyEvent, ICellEditor } from "@ag-grid-community/all-modules"
import { forwardRef, useImperativeHandle, useEffect, useState, useRef } from "react"
import CaretSizeRenderer from "Components/AgGridComponent/Renderer/CaretSizeRenderer";
import { AgGridReact } from "@ag-grid-community/react";
import {NumericOnlyEditor} from "./NumericOnlyEditor";
import ActionCellRenderer, { ActionCellParams } from "Components/AgGridComponent/Renderer/ActionCellRender";
import { getARandomNumber, UniqueValueProvider } from "Utilities/Utilities";
import { CaretSizeEditor, CaretSizeValue, CaretSizeValueOldAndNewValue } from "Components/AgGridComponent/Editors/CaretSizeEditor";
import QuantityMediatorWrapper, { IQuantityMediatorWrapper } from '../../../../Utilities/QuatityMediatorWrapper';
import { addWarn } from "Utilities/AlertUtility";
import { CustomPrice } from "Types/DTO";
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules//dist/styles/ag-theme-alpine.css';
import { CustomPriceGridEditorParams, CustomPriceProps, CustomPriceCellValueChnageEvent, CustomPriceGridCellRendererParams, CustomPriceGridValueGetterParams, CustomPriceRowData, CustomPriceValueSetterPrams, PriceGridContext, RowTransactionData, GridData } from './CustomPriceEditor.d';
import { CellEditorParams, OutgoingUpdateRow, ColLiteral } from '../../Add_Update/OutgoingGrid.d';
import CellClassRuleSpecifier from "Components/AgGridComponent/StyleSpeficier/ShipmentCellStyle";
import { CustomPriceValidation } from "Validation/CustomPriceCollectionValidation";
import { ToolTipComponent, ToolTipGetter } from "Components/AgGridComponent/Renderer/ToolTipRenderer";

type CustomPriceGridRef = {
    getValue(): CustomPrice[];
}
export default forwardRef<ICellEditor, CellEditorParams<OutgoingUpdateRow['CustomCaratPrices']>>((params, ref) => {
    const [data, setData] = useState<CustomPrice[]>(params.data.Shipment.CustomCaratPrices.Prices || []);
    const isProductIdValid = params.data.Shipment.ProductId !== -1;
    const defaultPrice: number = isProductIdValid ? params.context.getProductDetails(params.data.Shipment.ProductId).PricePerCaret : 0;
    const customGridRef = useRef<CustomPriceGridRef>(null);
    useImperativeHandle(ref, () => ({
        getValue() {
            return customGridRef.current?.getValue();
        },
        isCancelBeforeStart() {
            return !isProductIdValid && params.data.Shipment.TotalQuantityShiped > 0;
        },
        isPopup() {
            return true;
        }
    })
    );
    return <CustomPriceGrid initialData={{ CaretSize: params.data.Shipment.CaretSize, Data: data, DefaultPrice: defaultPrice, QuantityLimit: params.data.Shipment.TotalQuantityShiped }} ref={customGridRef} />
});

const defaultColDef: ColDef = {
    flex: 1,
    editable: true,
    tooltipComponentFramework: ToolTipComponent
}

function getColId(name: ColLiteral<CustomPrice>) {
    let colId;
    switch (name) {
        case 'Id':
            colId = '1'; break;
        case 'PricePerCarat': colId = '2'; break;
        case 'Quantity': colId = '3'; break;
        case 'S.No.': colId = '4'; break;
        default: colId = null; break;
    }
    return colId;
}
type GridApis = {
    gridApi: GridApi;
    columnApi: ColumnApi;
}
const ToolTipValueGetter = (name: keyof CustomPriceRowData) => ToolTipGetter<CustomPriceRowData, CustomPriceValidation>(CustomPriceValidation, name);
const ClassSpecifier = (name: keyof CustomPriceRowData) => CellClassRuleSpecifier<CustomPriceRowData, CustomPriceValidation>(name, CustomPriceValidation);

const CustomPriceGrid = forwardRef<CustomPriceGridRef, CustomPriceProps>((props, ref) => {
    const gridApis = useRef<GridApis>();
    const [quantityMediator] = useState<IQuantityMediatorWrapper>(new QuantityMediatorWrapper(props.initialData.QuantityLimit));
    const list:CustomPrice[] = props.initialData.Data.length ? props.initialData.Data : [{ Id: getARandomNumber(), PricePerCarat: props.initialData.DefaultPrice, Quantity: 0 }];
    const [uniqueValueProvider] = useState<UniqueValueProvider>(new UniqueValueProvider(undefined, undefined, props.initialData.Data.map(e => e.Id)));

    useImperativeHandle(ref, () => ({
        getValue: function () {
            const { gridApi: api } = gridApis.current!;
            const data: CustomPrice[] = [];
            api?.forEachNode(node => {
                data.push(node.data);
            });
            const firstElement = data[0] as CustomPrice;
            if (firstElement && firstElement.Quantity === 0) {
                return [];
            }
            return data;
        }
    }));
    const addAPrice = () => {
        const leftQuantity = quantityMediator.GetQuantityLimit();

        if (leftQuantity > 0) {
            const { gridApi: api } = gridApis.current!;
            const data: CustomPrice[] = [];
            api?.forEachNode(node => data.push(node.data));
            if (!data.find(e => e.Quantity === 0)) {
                const newPrice: CustomPriceRowData = {
                    Id: uniqueValueProvider.GetUniqueValue(),
                    PricePerCarat: props.initialData.DefaultPrice,
                    Quantity: 0
                };
                const transaction: RowTransactionData = {
                    add: [newPrice]
                }
                api?.applyTransaction(transaction);
                api.refreshCells({columns:[getColId('Id')!],force:true})
            }
            else
                addWarn('Please, Fill Any Empty Row');
        }
        addWarn('Quantitites Sum Reach Equals To Sale');
    }

    const deleteAChild = (Id: number) => {
        quantityMediator.Unsubscribe(Id);
        const transaction: RowTransactionData = {
            remove: [{ Id: Id + '' }]
        }
        gridApis.current?.gridApi?.applyTransaction(transaction);
        gridApis.current?.gridApi?.refreshCells({columns:[getColId('Id')!],force:true})
    };

    const [options] = useState<GridOptions>({
        columnDefs: [
            {
                headerName: 'S.No',
                valueGetter: (params: CustomPriceGridValueGetterParams) => params.node!.rowIndex! + 1,
                editable: false,
                colId: getColId('S.No.')!
            },
            {
                headerName: 'Quantity',
                field: "Quantity",
                cellEditorFramework: CaretSizeEditor<CustomPriceGridEditorParams<CustomPrice['Quantity']>>(e => e.context.getCaretSize(), (e) => true, (e) => {
                    const quantityMediator = e.context.getQuantityMediator();
                    if (quantityMediator.IsQuantitySubscribed(e.data.Id)) {
                        quantityMediator.Unsubscribe(e.data.Id);
                    }
                    return quantityMediator.GetQuantityLimit();
                }),
                cellRendererFramework: CaretSizeRenderer<CustomPriceGridCellRendererParams<CustomPriceRowData['Quantity']>>(e => e.context.getCaretSize()),
                valueSetter: function (params: CaretSizeValueOldAndNewValue<CustomPriceValueSetterPrams<number>>) {
                    params.data.Quantity = params.newValue.IsValid ? params.newValue.Value : params.oldValue;
                    return true;
                },
                onCellValueChanged: function (params: CustomPriceCellValueChnageEvent<number>) {
                    const quantityMediator = params.context.getQuantityMediator();
                    quantityMediator.Subscribe(params.data.Id, params.newValue);
                },
                colId: getColId('Quantity')!,
                cellClassRules: ClassSpecifier('Quantity'),
                tooltipValueGetter: ToolTipValueGetter('Quantity')
            },
            {
                headerName: 'Price',
                field: 'PricePerCarat',
                colId: getColId('PricePerCarat')!,
                cellEditorFramework: NumericOnlyEditor,
                cellClassRules: ClassSpecifier('PricePerCarat'),
                tooltipValueGetter: ToolTipValueGetter("PricePerCarat")
            },
            {
                headerName: "Action",
                field: 'Id',
                cellRendererFramework: ActionCellRenderer,
                cellRendererParams: {
                    addAChild: addAPrice,
                    deleteAChild: deleteAChild
                } as ActionCellParams<number>,
                editable: false,
                colId: getColId('Id')!
            }],
        getRowNodeId: (data: CustomPriceRowData) => data.Id + '',
        context: {
            getCaretSize: () => props.initialData.CaretSize,
            getQuantityMediator: function () { return quantityMediator; }
        } as PriceGridContext,
        // onCellValueChanged: (event: PriceGridCellValueChangedEvent) => {
        //     setList(list.map((e, index) => index === event.rowIndex ? { ...event.data } : e));
        // },
        defaultColDef: defaultColDef
    });
    useEffect(() => {
        for (let element of list) {
            quantityMediator.Subscribe(element.Id, element.Quantity);
        }
    }, [])
    const onGridReady = function (event: GridReadyEvent) {
        gridApis.current = {
            columnApi: event.columnApi,
            gridApi: event.api
        };
        event.api.setFocusedCell(0, getColId('Quantity')!);
    }
    return (<div className="ag-theme-alpine" style={{ height: 230, width: 600 }}>
        <AgGridReact gridOptions={options} modules={AllCommunityModules} onGridReady={onGridReady} rowData={list}>
        </AgGridReact>
    </div>);
});