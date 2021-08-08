import React from "react";
import { RouteComponentProps } from "react-router";
import { AgGridReact } from '@ag-grid-community/react';
import { ColDef, GridOptions } from '@ag-grid-community/all-modules';
import { IOutogingGridRowValue, ValueGetterParams, ValueSetterParams } from './OutgoingGrid.d';
import { IOutgoingShipmentAddDetail } from "Types/DTO";
import { FlavourCellRenderer, ProductCellRenderer } from "./Component/Renderers/Renderers";
import CaretSizeRenderer from "Components/AgGridComponent/Renderer/CaretSizeRenderer";
import { GridSelectEditor } from "Components/AgGridComponent/Editors/SelectWithAriaEditor";
import { Parser } from "Utilities/Utilities";
import { CaretSizeEditor } from "Components/AgGridComponent/Editors/CaretSizeEditor";

interface OutgoingGridProps extends RouteComponentProps<{ id?: string }> {
}
type OutgoingGridState = {
    GridOptions: GridOptions;
}
const CaretRenderer = CaretSizeRenderer<IOutogingGridRowValue>(e => e.Shipment.CaretSize);

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
        headerName: 'Quantity Shiped',
        valueGetter: function (params: ValueGetterParams) {
            return params.data.Shipment.TotalQuantityShiped;
        },
        valueSetter: function (params: ValueSetterParams<IOutgoingShipmentAddDetail['TotalQuantityShiped']>) {
            params.data.Shipment.TotalQuantityShiped = params.newValue;
            return true;
        },
        cellRendererFramework: CaretRenderer,
        cellEditorFramework: CaretSizeEditor<IOutogingGridRowValue, any>(e => e.Shipment.CaretSize, (e) => e.Shipment.ProductId !== -1)
    }
    
]
const actionColDef: ColDef = {
    headerName: 'Action'
}
export default class OutgoingGrid extends React.Component<OutgoingGridProps, OutgoingGridState>{
    constructor(props: OutgoingGridProps) {
        super(props);
        this.state = {

        }
    }
    render() {
        const { GridOptions } = this.state;

        return (<div className="ag-theme-alpine">
            <AgGridReact gridOptions={GridOptions}></AgGridReact>
        </div>);
    }
}