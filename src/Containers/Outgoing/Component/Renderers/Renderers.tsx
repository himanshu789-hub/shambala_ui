import { SelectWithAriaRenderer } from 'Components/AgGridComponent/Renderer/SelectWithAriaRenderer';
import { OutgoingGridRowCode } from 'Enums/Enum';
import { CSSProperties } from 'react';
import { IOutgoingShipmentAddDetail, IOutgoingShipmentUpdateDetail } from 'Types/DTO';
import { getQuantityInText } from 'Utilities/Utilities';
import { CellRendererParams, RowClassParams } from '../../OutgoingGrid.d';

export function ProductCellRenderer(params: CellRendererParams<IOutgoingShipmentAddDetail['ProductId']>) {
    return params.data.Observer.GetProducts().find(e => e.Id === params.data.Shipment.ProductId)?.Title ?? '--';
}
export const FlavourCellRenderer = SelectWithAriaRenderer<CellRendererParams<IOutgoingShipmentAddDetail['FlavourId']>>
    (e => e.data.Observer.GetFlavours().map(e => ({ label: e.Title, value: e.Id })), (e) => e.data.Shipment.FlavourId !== -1);

export const CustomPriceRenderer = (params: CellRendererParams<IOutgoingShipmentUpdateDetail['CustomCaratPrices']>) => {
    const prices = params.value;
    if (!prices)
        return <span>N/A</span>;
    return params.value.map(e => `${getQuantityInText(e.Quantity, params.data.Shipment.CaretSize)}->${e.Price}`).join(" | ");
}
export const RowStyleSpecifier = function (params: RowClassParams): CSSProperties {
    let css: CSSProperties = { background: 'initial' }
    switch (params.data.Status) {
        case OutgoingGridRowCode.OUT_OF_STOCK:
            css = { background: '#ff9966' };
            break;
        default: break;
    }
    return css;
}