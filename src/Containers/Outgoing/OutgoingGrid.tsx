import React from "react";
import { RouteComponentProps } from "react-router";
import { AgGridReact } from '@ag-grid-community/react';
import { ColDef, ColGroupDef, ColumnApi, GridApi, GridOptions } from '@ag-grid-community/all-modules';
import { ValueGetterParams, ValueSetterParams, EditableCallbackParams, CellRendererParams, OutgoingUpdateRow, CellEditorParams, CellValueChangedEvent, QuantityCellValueChangeEvent, GridContext, OutgoingRowDataTransaction, IOutgoingGridRowValue } from './OutgoingGrid.d';
import { IOutgoingShipmentAddDetail, Product } from "Types/DTO";
import { CustomPriceRenderer, FlavourCellRenderer, ProductCellRenderer } from "./Component/Renderers/Renderers";
import CaretSizeRenderer from "Components/AgGridComponent/Renderer/CaretSizeRenderer";
import { GridSelectEditor } from "Components/AgGridComponent/Editors/SelectWithAriaEditor";
import { getARandomNumber, Parser } from "Utilities/Utilities";
import { CaretSizeEditor, CaretSizeCellEquals, CaretSizeValue } from "Components/AgGridComponent/Editors/CaretSizeEditor";
import ActionCellRenderer, { ActionCellParams } from 'Components/AgGridComponent/Renderer/ActionCellRender';
import CustomPriceEditor from "./Component/Editors/CustomPriceEditor";
import CellClassRuleSpecifier from "Components/AgGridComponent/StyleSpeficier/ShipmentCellStyle";
import OutgoingValidator from 'Validation/OutgoingValidation';
import QuantityMediatorWrapper from './Component/Editors/QuatityMediatorWrapper';
import MediatorSubject from 'Utilities/MediatorSubject';

interface OutgoingGridProps extends RouteComponentProps<{ id?: string }> {
}
type OutgoingGridState = {
    GridOptions: GridOptions;
    IsOnUpdate: boolean;
}
const CaretRenderer = CaretSizeRenderer<CellRendererParams<number>>(e => e.data.Shipment.CaretSize);
const defaultColDef: ColDef = {
    flex: 1,
    editable: true
}
const calculateSaleColumnValue = function (params: CellValueChangedEvent<CaretSizeValue>) {
    params.node.setDataValue(params.columnApi.getAllDisplayedColumns()[params.context.getColumnIndex('TotalQuantitySale')!], params.data.Shipment.TotalQuantityShiped.Value - params.data.Shipment.TotalQuantityReturned.Value);
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
        cellRendererFramework: ProductCellRenderer,
        cellEditorFramework: GridSelectEditor<IOutgoingGridRowValue, any>(e => Parser.ProductsToValueContainer(e.Observer.GetProduct())),
        onCellValueChanged:function(params:CellValueChangedEvent<OutgoingUpdateRow['ProductId']>){
              
        } 
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
        cellRendererFramework: FlavourCellRenderer,
        cellEditorFramework: GridSelectEditor<IOutgoingGridRowValue, any>(e => e.Observer.GetFlavours().map(e => ({ label: e.Title, value: e.Id })), (e) => e.Shipment.ProductId !== -1)
    },
    {
        headerName: 'Caret Size',
        valueGetter: function (params: ValueGetterParams) {
            return params.data.Shipment.CaretSize;
        },
        editable: false
    },
    {
        headerName: 'Taken',
        valueGetter: function (params: ValueGetterParams) {
            return params.data.Shipment.TotalQuantityShiped;
        },
        valueSetter: function (params: ValueSetterParams<OutgoingUpdateRow['TotalQuantityShiped']>) {
            params.data.Shipment.TotalQuantityShiped = params.newValue;
            return true;
        },
        onCellValueChanged: function (params: CellValueChangedEvent<OutgoingUpdateRow['TotalQuantityShiped']>) {

        },
        cellRendererFramework: CaretRenderer,
        cellEditorFramework: CaretSizeEditor<CellEditorParams<OutgoingUpdateRow['TotalQuantityShiped']>>(e => e.data.Shipment.CaretSize, (e) => e.data.Shipment.ProductId !== -1)
    }
];

const CellClassRule = (name: keyof OutgoingUpdateRow) => CellClassRuleSpecifier<OutgoingUpdateRow, OutgoingValidator>(name, OutgoingValidator);
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
        equals: CaretSizeCellEquals,
        cellRendererFramework: CaretRenderer,
        onCellValueChanged: function (params: CellValueChangedEvent<OutgoingUpdateRow['TotalQuantityReturned']>) {
            calculateSaleColumnValue(params);
        },
        cellEditorFramework: CaretSizeEditor<CellEditorParams<OutgoingUpdateRow['TotalQuantityReturned']>>(e => e.data.Shipment.CaretSize, (e) => e.data.Shipment.TotalQuantitySale.Value > 0)
    },
    {
        headerName: 'Sale',
        valueGetter: (params: ValueGetterParams) => {
            return params.data.Shipment.TotalQuantitySale;
        },
        editable: false,
        equals: CaretSizeCellEquals,
        cellRendererFramework: CaretRenderer,
        onCellValueChanged: function (params: QuantityCellValueChangeEvent) {
            const customPrices = params.data.Shipment.CustomPrices;
            const quantityMediator = new QuantityMediatorWrapper(params.newValue.Value);
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
            params.data.Shipment.CustomPrices = customPrices;
            const column = params.columnApi.getAllDisplayedColumns()[params.context.getColumnIndex('CustomPrices')!];
            params.node.setDataValue(column, customPrices);
        },
    },
    {
        headerName: 'Scheme',
        children: [
            {
                headerName: 'Quantity',
                valueGetter: (params: ValueGetterParams) => params.data.Shipment.TotalSchemeQuantity
            },
            {
                headerName: 'Price',
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
        cellRendererFramework: CustomPriceRenderer,
        cellEditorFramework: CustomPriceEditor,
        cellClassRules: CellClassRule('CustomPrices')
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
    private products:Product[];

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
                    getProductDetails: (Id:number)=>this.products.find(e=>e.Id===Id)!,
                    IsOnUpdate: () => IsOnUpdate
                } as GridContext,
                getRowNodeId: (data: IOutgoingGridRowValue) => data.Id
            },
            IsOnUpdate
        }
    }
    getProductDetails=(Id:number)=>{
      return this.products.find(e=>e.Id===Id)!;
    }
    createAShipment = (componentId: number): IOutgoingGridRowValue => {
        return {
            Id: componentId + '',
            Observer: this.mediatorSubject.GetAObserver(1, componentId),
            Shipment: {
                CaretSize: 0, CustomPrices: [], FlavourId: -1, Id: componentId, ProductId: -1, SchemePrice: 0,
                TotalQuantityRejected: { Value: 0 }, TotalQuantityReturned: { Value: 0 }, TotalQuantitySale: { Value: 0 }, TotalQuantityShiped: { Value: 0 },
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