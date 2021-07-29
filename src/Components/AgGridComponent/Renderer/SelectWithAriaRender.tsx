import { CellValueChangedEvent, Column, ICellRendererParams } from "@ag-grid-community/all-modules";
import { ShipmentDTO } from "Types/DTO";
import { GridCellValueChangeEvent, GridGetterParams, GridRendererParams, GridRowDataTransaction, GridSetterParams, IRowValue } from "../Grid";

export function ProductCellRenderer(props: GridRendererParams<ShipmentDTO['ProductId']>) {
    const { data, value } = props;
    return data.Observer?.GetProduct().find(e => e.Id == value)?.Title ?? '--';
}
export function FlavourCellRenderer(props: GridRendererParams<ShipmentDTO['FlavourId']>) {
    const { data, value } = props;
    return data.Observer.GetFlavours().find(e => e.Id == value)?.Title ?? '--';
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
function isColumnsNull(Columns: Column[]|null) {
    if (!Columns) {
        console.error('Grid getAllColumns() is empty');
        return true;
    }
    return false;
}
export const ProductValueChangedEvent = (event: GridCellValueChangeEvent<ShipmentDTO['ProductId']>) => {
    const { columnApi, data, context } = event;
    const columns = columnApi.getAllColumns();
    if (!isColumnsNull(columns)) {
        const isFlavourExists = data.Observer.GetFlavours().find(e => e.Id == data.Shipment.FlavourId) != null;
        const newRowData: IRowValue = { ...data, Shipment: { ...data.Shipment, CaretSize: context.getCartetSizeByProductId(event.newValue), FlavourId: isFlavourExists ? data.Shipment.FlavourId : -1 } };
        const transaction: GridRowDataTransaction = {
            update: [newRowData]
        }
        event.api.applyTransaction(transaction);
    }
}

export const FlavourValueChangedEvent = (event: GridCellValueChangeEvent<ShipmentDTO['FlavourId']>) => {
    const { data, columnApi } = event;
    const columns = columnApi.getAllColumns();
    if (!isColumnsNull(columns)) {
        const observer = data.Observer;
        observer.UnsubscribeToQuantity();
        const quantityLimit = observer.GetQuantityLimit();
        if(data.Shipment.TotalRecievedPieces>quantityLimit){
            data.Shipment.TotalRecievedPieces = 0;
        }
        observer.SetQuantity(data.Shipment.TotalRecievedPieces);
        const transaction:GridRowDataTransaction = {
            update:[data]
        }
        event.api.applyTransaction(transaction);
    }

}