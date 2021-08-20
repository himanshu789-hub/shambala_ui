import { SelectWithAriaRenderer } from 'Components/AgGridComponent/Renderer/SelectWithAriaRenderer';
import { IOutgoingShipmentAddDetail, IOutgoingShipmentUpdateDetail } from 'Types/DTO';
import { getQuantityInText } from 'Utilities/Utilities';
import { CellRendererParams } from '../../OutgoingGrid.d';

export function ProductCellRenderer(params: CellRendererParams<IOutgoingShipmentAddDetail['ProductId']>) {
    return params.data.Observer.GetProduct().find(e => e.Id === params.data.Shipment.ProductId)?.Title ?? '--';
}
export const FlavourCellRenderer = SelectWithAriaRenderer<CellRendererParams<IOutgoingShipmentAddDetail['FlavourId']>>
    (e => e.data.Observer.GetFlavours().map(e => ({ label: e.Title, value: e.Id })), (e) => e.data.Shipment.ProductId !== -1);

export const CustomPriceRenderer = (params: CellRendererParams<IOutgoingShipmentUpdateDetail['CustomPrices']>) => {
    const prices = params.value;
    if (!prices)
        return <span>N/A</span>;
    return params.value.map(e => `${getQuantityInText(e.Quantity, params.data.Shipment.CaretSize)}->${e.Price}`).join(" | ");
}