import { CellValueChangedEvent, Column, ICellRendererParams } from "@ag-grid-community/all-modules";
import { ShipmentDTO } from "Types/DTO";
import { GridCellValueChangeEvent, GridGetterParams, GridRendererParams, GridRowDataTransaction, GridSetterParams } from "../Grid.d";

export function ProductCellRenderer(props: GridRendererParams<ShipmentDTO['ProductId']>) {
    const { data, value } = props;
    return data.Observer?.GetProduct().find(e => e.Id == value)?.Title ?? '--';
}
export function FlavourCellRenderer(props: GridRendererParams<ShipmentDTO['FlavourId']>) {
    const { data, value } = props;
    if(data.Shipment.ProductId==-1)
    return '--';
    return data.Observer.GetFlavours().find(e => e.Id == value)?.Title ?? '--';
}


export const ProductValueGetter = (props: GridGetterParams) => props.data.Shipment.ProductId;

export const FlavourValueGetter = (props: GridGetterParams) => props.data.Shipment.FlavourId;

export const ProductValueSetter = (props: GridSetterParams<ShipmentDTO['ProductId']>) => {
    props.data.Shipment.ProductId = props.newValue;
    return true;
}

export const FlavourValueSetter = (props: GridSetterParams<ShipmentDTO['FlavourId']>) => {
    props.data.Shipment.FlavourId = props.newValue;
    return true;
}
function isColumnsNull(Columns: Column[] | null) {
    if (!Columns) {
        console.error('Grid getAllColumns() is empty');
        return true;
    }
    return false;
}
export const ProductValueChangedEvent = (event: GridCellValueChangeEvent<ShipmentDTO['ProductId']>) => {
    const { columnApi, data, context } = event;
    const columns = columnApi.getAllColumns();
    data.Observer.Unubscribe();
    if (!isColumnsNull(columns)) {
        data.Observer.SetProduct(event.newValue);      
        const isFlavourExists = data.Observer.GetFlavours().find(e => e.Id == data.Shipment.FlavourId) != null;
        data.Shipment.CaretSize = context.getCartetSizeByProductId(event.newValue);
        data.Shipment.FlavourId = isFlavourExists ? data.Shipment.FlavourId : -1;
        data.Shipment.TotalRecievedPieces = isFlavourExists ? data.Shipment.TotalRecievedPieces : 0;
        const transaction: GridRowDataTransaction = {
            update: [data]
        }
        event.api.applyTransaction(transaction);
        event.api.refreshCells({ rowNodes: [event.node], force: true });
    }
}

export const FlavourValueChangedEvent = (event: GridCellValueChangeEvent<ShipmentDTO['FlavourId']>) => {
    const { data, columnApi } = event;
    const columns = columnApi.getAllColumns();
    const quantityIndex = event.context.getColumnIndex('TotalRecievedPieces');
    const observer = data.Observer;
    observer.SetFlavour(event.newValue);
    if (!isColumnsNull(columns) && quantityIndex) {
        let quantity = data.Shipment.TotalRecievedPieces;
        observer.UnsubscribeToQuantity();
        const quantityLimit = observer.GetQuantityLimit();
        if (data.Shipment.TotalRecievedPieces > quantityLimit) {
            quantity = 0;
        }
        observer.SetQuantity(quantity);
        event.node.setDataValue(columns![quantityIndex].getColId(), quantity);
    }

}