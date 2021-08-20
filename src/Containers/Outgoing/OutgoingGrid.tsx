import React from "react";
import { RouteComponentProps } from "react-router";
import { AgGridReact } from '@ag-grid-community/react';
import { ColDef, ColGroupDef, GridOptions, TooltipRendererParams } from '@ag-grid-community/all-modules';
import { ValueGetterParams, ValueSetterParams, EditableCallbackParams, CellRendererParams, OutgoingUpdateRow, CellEditorParams, CellValueChangedEvent, GridContext, OutgoingRowDataTransaction, IOutgoingGridRowValue, QuantityValueParser, CustomPriceRowData, CellClassParams, ToolTipRendererParams } from './OutgoingGrid.d';
import { IOutgoingShipmentAddDetail, Product } from "Types/DTO";
import { CustomPriceRenderer, FlavourCellRenderer, ProductCellRenderer } from "./Component/Renderers/Renderers";
import CaretSizeRenderer from "Components/AgGridComponent/Renderer/CaretSizeRenderer";
import { GridSelectEditor } from "Components/AgGridComponent/Editors/SelectWithAriaEditor";
import { getARandomNumber, Parser } from "Utilities/Utilities";
import { CaretSizeEditor, CaretSizeValue } from "Components/AgGridComponent/Editors/CaretSizeEditor";
import ActionCellRenderer, { ActionCellParams } from 'Components/AgGridComponent/Renderer/ActionCellRender';
import CustomPriceEditor from "./Component/Editors/CustomPriceEditor";
import CellClassRuleSpecifier from "Components/AgGridComponent/StyleSpeficier/ShipmentCellStyle";
import OutgoingValidator from 'Validation/OutgoingValidation';
import QuantityMediatorWrapper from './Component/Editors/QuatityMediatorWrapper';
import MediatorSubject from 'Utilities/MediatorSubject';
import config from 'config.json';
import { ToolTipComponent, ToolTipGetter } from "Components/AgGridComponent/Renderer/ToolTipRenderer";

interface OutgoingGridProps extends RouteComponentProps<{ id?: string }> {
}
type OutgoingGridState = {
    GridOptions: GridOptions;
    IsOnUpdate: boolean;
}
const defaultColDef: ColDef = {
    flex: 1,
    editable: true,
    tooltipComponentFramework: ToolTipComponent
}
const ClassSpecifier = (name: keyof OutgoingUpdateRow) => CellClassRuleSpecifier(name, OutgoingValidator, (params: CellClassParams) => params.data.Shipment);
//@ts-ignore
const ToolTipValueGetter = (name: keyof OutgoingUpdateRow) => ToolTipGetter(OutgoingValidator, name, (e: ToolTipRendererParams) => e.data.Shipment);
const QuantityCellRederer = CaretSizeRenderer<CellRendererParams<CaretSizeValue>>(e => e.data.Shipment.CaretSize, e => e.value.Value);
const ReInitializeCustomPrice = function (customPrices: CustomPriceRowData[], quantity: number) {
    const quantityMediator = new QuantityMediatorWrapper(quantity);
    for (let i = 0; i < customPrices.length; i++) {
        if (customPrices[i].Quantity.Value.Value > quantityMediator.GetQuantityLimit()) {
            for (let j = i; j < customPrices.length; j++) {
                customPrices[j].Quantity.IsValid = false;
                customPrices[j].Quantity.Value.MaxLimit = 0;
            }
            break;
        }
        else {
            const limit = quantityMediator.GetQuantityLimit();
            quantityMediator.Subscribe(i, customPrices[i].Quantity.Value.Value);
            customPrices[i].Quantity.Value.MaxLimit = limit;
        }
    }
    return customPrices;
}
const commonColDefs: ColDef[] = [
    {
        headerName: 'Product Name',
        valueGetter: function (params: ValueGetterParams) {
            return params.data.Shipment.ProductId;
        },
        valueSetter: function (params: ValueSetterParams<IOutgoingShipmentAddDetail['ProductId']>) {
            params.data.Shipment.ProductId = params.newValue;
            return true;
        },
        cellClassRules: ClassSpecifier('ProductId'),
        cellRendererFramework: ProductCellRenderer,
        cellEditorFramework: GridSelectEditor<IOutgoingGridRowValue, any>(e => Parser.ProductsToValueContainer(e.Observer.GetProduct())),
        onCellValueChanged: function (params: CellValueChangedEvent<OutgoingUpdateRow['ProductId']>) {
            const { data: { Observer, Shipment } } = params;
            const IsOnUpdate = params.context.IsOnUpdate;
            Observer.SetProduct(params.newValue);
            const { FlavourId, Quantity } = Observer.GetObserverInfo();
            Shipment.FlavourId = FlavourId || -1;
            if (!Quantity) {
                Shipment.TotalQuantityShiped = { Value: 0 };
            }
            else {
                Shipment.TotalQuantityShiped.MaxLimit = Quantity;
            }
        },
        tooltipValueGetter: ToolTipValueGetter('ProductId')
    },
    {
        headerName: 'Flavour Name',
        valueGetter: function (params: ValueGetterParams) {
            return params.data.Shipment.FlavourId;
        },
        valueSetter: function (params: ValueSetterParams<IOutgoingShipmentAddDetail['FlavourId']>) {
            params.data.Shipment.FlavourId = params.newValue;
            return true;
        },
        tooltipValueGetter: ToolTipValueGetter('FlavourId'),
        cellClassRules: ClassSpecifier('FlavourId'),
        cellRendererFramework: FlavourCellRenderer,
        onCellValueChanged: function (params: CellValueChangedEvent<OutgoingUpdateRow['FlavourId']>) {
            const { data: { Observer, Shipment } } = params;
            Observer.SetFlavour(params.newValue);
            const { Quantity } = Observer.GetObserverInfo();
        },
        cellEditorFramework: GridSelectEditor<IOutgoingGridRowValue, any>(e => e.Observer.GetFlavours().map(e => ({ label: e.Title, value: e.Id })), (e) => e.Shipment.ProductId !== -1)
    },
    {
        headerName: 'Caret Size',
        valueGetter: function (params: ValueGetterParams) {
            return params.data.Shipment.CaretSize;
        },
        editable: false,
        cellClassRules: ClassSpecifier('CaretSize')
    },
    {
        headerName: 'Taken',
        valueGetter: function (params: ValueGetterParams) {
            return params.data.Shipment.TotalQuantityShiped;
        },
        valueSetter: function (params: ValueSetterParams<OutgoingUpdateRow['TotalQuantitySale']>) {
            params.data.Shipment.TotalQuantityShiped = params.data.Shipment.TotalQuantityShiped;
            return true;
        },
        onCellValueChanged: function (params: CellValueChangedEvent<OutgoingUpdateRow['TotalQuantityShiped']>) {
            params.data.Shipment.TotalQuantitySale = params.newValue.Value - params.data.Shipment.TotalQuantityReturned.Value;
            params.data.Shipment.TotalQuantityReturned = { ...params.data.Shipment.TotalQuantityReturned, MaxLimit: params.data.Shipment.TotalQuantityShiped.Value };
        },
        valueParser: function (params: QuantityValueParser) {
            const { newValue: { Value, IsValid } } = params;
            return { Value: IsValid ? Value : 0 };
        },
        tooltipValueGetter: ToolTipValueGetter('TotalQuantityShiped'),
        cellClassRules: ClassSpecifier('TotalQuantityShiped'),
        cellRendererFramework: QuantityCellRederer,
        cellEditorFramework: CaretSizeEditor<CellEditorParams<OutgoingUpdateRow['TotalQuantityShiped']>>(e => e.data.Shipment.CaretSize, (e) => e.data.Shipment.ProductId !== -1)
    }
];

const updateColDefs: (ColDef | ColGroupDef)[] = [
    {
        headerName: 'Return',
        valueGetter: (params: ValueGetterParams) => params.data.Shipment.TotalQuantityReturned,
        valueSetter: (params: ValueSetterParams<OutgoingUpdateRow['TotalQuantityReturned']>) => {
            params.data.Shipment.TotalQuantityReturned = params.newValue;
            return true;
        },
        editable: (params: EditableCallbackParams) => {
            return params.data.Shipment.TotalQuantityShiped.Value > 0;
        },
        cellRendererFramework: QuantityCellRederer,
        valueParser: function (params: QuantityValueParser) {
            const { newValue: { Value, IsValid } } = params;
            return { Value: IsValid ? Value : 0 } as CaretSizeValue;
        },
        onCellValueChanged: function (params: CellValueChangedEvent<OutgoingUpdateRow['TotalQuantityReturned']>) {
            params.data.Shipment.TotalQuantitySale = params.data.Shipment.TotalQuantityShiped.Value - params.newValue.Value;
        },
        cellClassRules: ClassSpecifier('TotalQuantityReturned'),
        tooltipValueGetter: ToolTipValueGetter('TotalQuantityReturned'),
        cellEditorFramework: CaretSizeEditor<CellEditorParams<OutgoingUpdateRow['TotalQuantityReturned']>>(e => e.data.Shipment.CaretSize, (e) => e.data.Shipment.TotalQuantitySale > 0)
    },
    {
        headerName: 'Sale',
        valueGetter: (params: ValueGetterParams) => {
            return params.data.Shipment.TotalQuantitySale;
        },
        editable: false,
        onCellValueChanged: function (params: CellValueChangedEvent<OutgoingUpdateRow['TotalQuantitySale']>) {
            const customPrices = params.data.Shipment.CustomPrices;
            params.data.Shipment.CustomPrices = ReInitializeCustomPrice(customPrices, params.newValue);
            const schemeQuantity = params.context.getProductDetails(params.data.Shipment.ProductId).SchemeQuantity;
            if (schemeQuantity) {
                const schemeProduct = params.context.getProductDetails(config.SchemeProductId);
                const totalCaret = Math.floor(params.newValue / params.data.Shipment.CaretSize);
                const totalBottle = schemeQuantity * totalCaret;
                const totalPrice = (schemeProduct.Price / schemeProduct.CaretSize) * totalBottle;
                const { data: { Shipment } } = params;
                Shipment.SchemePrice = totalPrice;
                Shipment.TotalSchemeQuantity = totalBottle;
            }
        },
        cellClassRules: ClassSpecifier('TotalQuantitySale'),
        tooltipValueGetter: ToolTipValueGetter('TotalQuantitySale')
    },
    {
        headerName: 'Scheme',
        children: [
            {
                headerName: 'Quantity',
                valueGetter: (params: ValueGetterParams) => params.data.Shipment.TotalSchemeQuantity,
                tooltipValueGetter:ToolTipValueGetter('TotalSchemeQuantity')
            },
            {
                headerName: 'Price',
                tooltipValueGetter:ToolTipValueGetter('SchemePrice'),
                valueGetter: (params: ValueGetterParams) => params.data.Shipment.SchemePrice
            }
        ]
    },
    {
        headerName: 'Custom Price',
        valueGetter: (params: ValueGetterParams) => params.data.Shipment.CustomPrices,
        valueSetter: (params: ValueSetterParams<OutgoingUpdateRow['CustomPrices']>) => {
            params.data.Shipment.CustomPrices = params.newValue;
            return true;
        },
        tooltipValueGetter:ToolTipValueGetter('CustomPrices'),
        cellRendererFramework: CustomPriceRenderer,
        cellEditorFramework: CustomPriceEditor,
        cellClassRules: ClassSpecifier('CustomPrices')
    }
]
const getActionColDef = function (cellParams: ActionCellParams<string>): ColDef {
    return {
        headerName: 'Action',
        editable: false,
        valueGetter: function (params: ValueGetterParams) {
            return params.data.Shipment.Id;
        },
        cellRendererFramework: ActionCellRenderer,
        cellRendererParams: cellParams
    };
}
const getColumnIndex = function (name: keyof OutgoingUpdateRow) {
    let columnIndex: number | null = null;
    switch (name) {
        case 'ProductId':
            columnIndex = 0; break;
        case 'FlavourId':
            columnIndex = 1; break;
        case 'CaretSize':
            columnIndex = 2; break;
        case 'TotalQuantityShiped':
            columnIndex = 3; break;
        case 'TotalQuantityReturned':
            columnIndex = 4; break;
        case 'TotalQuantitySale':
            columnIndex = 5; break;
        case 'SchemePrice':
            columnIndex = 6; break;
        case 'CustomPrices':
            columnIndex = 7; break;
        case 'Id':
            columnIndex = 8; break;
    }
    return columnIndex;
}
export default class OutgoingGrid extends React.Component<OutgoingGridProps, OutgoingGridState>{
    private mediatorSubject: MediatorSubject;
    private products: Product[];

    constructor(props: OutgoingGridProps) {
        super(props);
        const { match: { params: { id } } } = this.props;
        let colDefs: ColDef[];
        const actionColDef = getActionColDef({ addAChild: this.addAShipment, deleteAChild: this.deleteAShipment });
        this.mediatorSubject = new MediatorSubject([]);
        this.products = [];
        if (id) {
            colDefs = [...commonColDefs, ...updateColDefs]
        }
        else
            colDefs = [...commonColDefs, actionColDef]
        const IsOnUpdate = id !== undefined;
        this.state = {
            GridOptions: {
                columnDefs: colDefs,
                context: {
                    getColumnIndex,
                    getProductDetails: (Id: number) => this.products.find(e => e.Id === Id)!,
                    IsOnUpdate
                } as GridContext,
                getRowNodeId: (data: IOutgoingGridRowValue) => data.Id
            },
            IsOnUpdate
        }
    }
    getProductDetails = (Id: number) => {
        return this.products.find(e => e.Id === Id)!;
    }
    createAShipment = (componentId: number): IOutgoingGridRowValue => {
        return {
            Id: componentId + '',
            Observer: this.mediatorSubject.GetAObserver(1, componentId),
            Shipment: {
                CaretSize: 0, CustomPrices: [], FlavourId: -1, Id: componentId, ProductId: -1, SchemePrice: 0,
                TotalQuantityRejected: { Value: 0 }, TotalQuantityReturned: { Value: 0 }, TotalQuantitySale: 0, TotalQuantityShiped: { Value: 0 },
                TotalSchemeQuantity: 0
            }
        }
    }
    addAShipment = () => {
        const { GridOptions: { api } } = this.state;
        const componentId = getARandomNumber();
        const transaction: OutgoingRowDataTransaction = {
            add: [this.createAShipment(componentId)]
        }
        api?.applyTransaction(transaction);
    }
    deleteAShipment = (Id: string) => {
        const { GridOptions: { api } } = this.state;
        this.mediatorSubject.UnsubscribeAComponent(1, Number.parseInt(Id));
        const transaction: OutgoingRowDataTransaction = {
            remove: [{ Id }]
        }
        api?.applyTransaction(transaction);
    }
    render() {
        const { GridOptions } = this.state;
        return (<div className="ag-theme-alpine">
            <AgGridReact gridOptions={GridOptions}></AgGridReact>
        </div>);
    }
}