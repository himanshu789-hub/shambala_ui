import { ICellRendererParams } from "@ag-grid-community/all-modules";
import { ShipmentDTO } from "Types/DTO";
import { GridGetterParams, GridRendererParams, GridSetterParams } from "../Grid";

export function ProductCellRenderer(props: GridRendererParams<ShipmentDTO['ProductId']>) {
    const { data, value } = props;
    return data.Observer?.GetProduct().find(e => e.Id == value)?.Title ?? '';
}
export function FlavourCellRenderer(props: GridRendererParams<ShipmentDTO['FlavourId']>) {
    const { data, value } = props;
    return data.Observer.GetProduct().find(e => e.Id == value)?.Title;
}


export const ProductValueGetter = (props: GridGetterParams) => props.data.Shipment.ProductId;

export const FlavourValueGetter = (props: GridGetterParams) => props.data.Shipment.FlavourId;

export const ProductValueSetter = (props: GridSetterParams<ShipmentDTO['ProductId']>) => {
    props.data.Shipment.ProductId = props.newValue;
    return true;
}

export const FlavourValueSetter = (props: GridSetterParams<ShipmentDTO['FlavourId']>) => {
    props.data.Shipment.FlavourId = props.data.Shipment.FlavourId;
    return true;
}