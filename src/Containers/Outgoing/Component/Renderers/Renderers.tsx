import { SelectWithAriaRenderer } from 'Components/AgGridComponent/Renderer/SelectWithAriaRenderer';
import { IOutgoingShipmentAddDetail } from 'Types/DTO';
import { CellRendererParams } from '../../OutgoingGrid.d';

export function ProductCellRenderer(params: CellRendererParams<IOutgoingShipmentAddDetail['ProductId']>) {
    return params.data.Observer.GetProduct().find(e => e.Id === params.data.Shipment.ProductId)?.Title ?? '--';
}
export const FlavourCellRenderer = SelectWithAriaRenderer<CellRendererParams<IOutgoingShipmentAddDetail['FlavourId']>>
    (e => e.data.Observer.GetFlavours().map(e => ({ label: e.Title, value: e.Id })), (e) => e.data.Shipment.ProductId !== -1);
