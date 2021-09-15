import { CellValueChangedEvent, Column, ICellRendererParams } from "@ag-grid-community/all-modules";
import { SelectWithAriaRenderer } from "Components/AgGridComponent/Renderer/SelectWithAriaRenderer";
import { ShipmentDTO } from "Types/DTO";
import { doFlavourExists } from "Utilities/Utilities";
import { ShipmentCellValueChangeEvent, ShipmentGridDataTransation, ShipmentGridGetterParams, ShipmentGridSetter, ShipmentRendererParams } from "../../ShipmentList.d"


export const ProductCellRenderer =
    SelectWithAriaRenderer<ShipmentRendererParams<ShipmentDTO['ProductId']>>(e => e.data.Observer.GetProducts().map(e => ({ label: e.Title, value: e.Id })),
        e => e.data.Shipment.ProductId !== -1);

export const FlavourCellRenderer = SelectWithAriaRenderer<ShipmentRendererParams<ShipmentDTO['FlavourId']>>((e) => (e.data.Observer.GetProducts().map(e => ({ label: e.Title, value: e.Id }))), (e) => e.data.Shipment.ProductId !== -1);



export const ProductValueGetter = (props: ShipmentGridGetterParams) => props.data.Shipment.ProductId;

export const FlavourValueGetter = (props: ShipmentGridGetterParams) => props.data.Shipment.FlavourId;

export const ProductValueSetter = (props: ShipmentGridSetter<ShipmentDTO['ProductId']>) => {
    props.data.Shipment.ProductId = props.newValue;
    return true;
}

export const FlavourValueSetter = (props: ShipmentGridSetter<ShipmentDTO['FlavourId']>) => {
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
export const ProductValueChangedEvent = (event: ShipmentCellValueChangeEvent<ShipmentDTO['ProductId']>) => {
    const { columnApi, data, context } = event;
    const columns = columnApi.getAllColumns();
    data.Observer.Unubscribe();
    if (!isColumnsNull(columns)) {
        data.Observer.SetProduct(event.newValue);
        const isFlavourExists = doFlavourExists(data.Observer.GetFlavours(), data.Shipment.FlavourId);
        data.Shipment.CaretSize = context.getCartetSizeByProductId(event.newValue);
        data.Shipment.FlavourId = isFlavourExists ? data.Shipment.FlavourId : -1;
        data.Shipment.TotalRecievedPieces = isFlavourExists ? data.Shipment.TotalRecievedPieces : 0;
        if (event.context.ShouldLimitQuantity) {
            data.Observer.SetQuantity(data.Shipment.TotalRecievedPieces);
        }
        const transaction: ShipmentGridDataTransation = {
            update: [data]
        }
        event.api.applyTransaction(transaction);
        event.api.refreshCells({ rowNodes: [event.node], force: true });
    }
}

export const FlavourValueChangedEvent = (event: ShipmentCellValueChangeEvent<ShipmentDTO['FlavourId']>) => {
    const { data, columnApi } = event;
    const columns = columnApi.getAllColumns();
    const quantityIndex = event.context.getColumnIndex('TotalRecievedPieces');
    const observer = data.Observer;
    observer.SetFlavour(event.newValue);
    if (!isColumnsNull(columns) && quantityIndex) {
        let quantity = data.Shipment.TotalRecievedPieces;
        observer.UnsubscribeIfSubscribedToQuantity();
        const quantityLimit = observer.GetQuantityLimit();
        if (data.Shipment.TotalRecievedPieces > quantityLimit) {
            quantity = 0;
        }
        if (event.context.ShouldLimitQuantity)
            observer.SetQuantity(quantity);
        event.node.setDataValue(columns![quantityIndex].getColId(), quantity);
    }

}