import React from "react";
import { RouteComponentProps } from "react-router";
import { AgGridReact } from '@ag-grid-community/react';
import { ColDef, ColGroupDef, GridOptions } from '@ag-grid-community/all-modules';
import { IOutogingGridRowValue, ValueGetterParams, ValueSetterParams, EditableCallbackParams, CellRendererParams, OutgoingUpdateRow, CellEditorParams } from './OutgoingGrid.d';
import { CustomPrice, IOutgoingShipmentAddDetail } from "Types/DTO";
import { CustomPriceRenderer, FlavourCellRenderer, ProductCellRenderer } from "./Component/Renderers/Renderers";
import CaretSizeRenderer from "Components/AgGridComponent/Renderer/CaretSizeRenderer";
import { GridSelectEditor } from "Components/AgGridComponent/Editors/SelectWithAriaEditor";
import { Parser } from "Utilities/Utilities";
import { CaretSizeEditor } from "Components/AgGridComponent/Editors/CaretSizeEditor";
import ActionCellRenderer, { ActionCellParams } from 'Components/AgGridComponent/Renderer/ActionCellRender';
import CustomPriceEditor from "./Component/Editors/CustomPriceEditor";
import CellClassRuleSpecifier from "Components/AgGridComponent/StyleSpeficier/ShipmentCellStyle";
import OutgoingValidator from 'Validation/OutgoingValidation';
import { GridEditorParams } from "Components/AgGridComponent/Grid";

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
        cellEditorFramework: GridSelectEditor<IOutogingGridRowValue, any>(e => Parser.ProductsToValueContainer(e.Observer.GetProduct()))
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
        cellEditorFramework: GridSelectEditor<IOutogingGridRowValue, any>(e => e.Observer.GetFlavours().map(e => ({ label: e.Title, value: e.Id })), (e) => e.Shipment.ProductId !== -1)
    },
    {
        headerName: 'Caret Size',
        valueGetter: function (params: ValueGetterParams) {
            return params.data.Shipment.CaretSize;
        },
        valueSetter: function (params: ValueSetterParams<IOutgoingShipmentAddDetail['CaretSize']>) {
            params.data.Shipment.FlavourId = params.newValue;
            return true;
        },
        cellRendererFramework: CaretRenderer
    },
    {
        headerName: 'Taken',
        valueGetter: function (params: ValueGetterParams) {
            return params.data.Shipment.TotalQuantityShiped;
        },
        valueSetter: function (params: ValueSetterParams<IOutgoingShipmentAddDetail['TotalQuantityShiped']>) {
            params.data.Shipment.TotalQuantityShiped = params.newValue;
            return true;
        },
        cellRendererFramework: CaretRenderer,
        cellEditorFramework: CaretSizeEditor<CellEditorParams<OutgoingUpdateRow['TotalQuantityShiped']>>(e => e.data.CaretSize, (e) => e.data.ProductId !== -1)
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
            return params.data.Shipment.TotalQuantityShiped > 0;
        },
        cellRendererFramework: CaretRenderer,
        cellEditorFramework: CaretSizeEditor<CellEditorParams<OutgoingUpdateRow['TotalQuantityReturned']>>(e => e.data.CaretSize, (e) => e.data.TotalQuantitySale > 0)
    },
    {
        headerName: 'Sale',
        valueGetter: (params: ValueGetterParams) => {
            return params.data.Shipment.TotalQuantitySale;
        },
        editable: false,
        cellRendererFramework: CaretRenderer
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

export default class OutgoingGrid extends React.Component<OutgoingGridProps, OutgoingGridState>{
    constructor(props: OutgoingGridProps) {
        super(props);
        const { match: { params: { id } } } = this.props;
        let colDefs: ColDef[];
        const actionColDef = getActionColDef({ addAChild: this.addAShipment, deleteAChild: this.deleteAShipment });
        if (id) {
            colDefs = [...commonColDefs, ...updateColDefs]
        }
        else
            colDefs = [...commonColDefs, actionColDef]

        this.state = {
            GridOptions: {
                columnDefs: colDefs
            },
            IsOnUpdate: id != undefined
        }
    }
    addAShipment = () => {

    }
    deleteAShipment = (Id: string) => {

    }
    render() {
        const { GridOptions } = this.state;

        return (<div className="ag-theme-alpine">
            <AgGridReact gridOptions={GridOptions}></AgGridReact>
        </div>);
    }
}