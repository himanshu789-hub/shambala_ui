import { CellClassParams, ICellRendererParams } from '@ag-grid-community/core';
import { SelectWithAriaRenderer } from 'Components/AgGridComponent/Renderer/SelectWithAriaRenderer';
import { OutgoingGridRowCode } from 'Enums/Enum';
import { CSSProperties } from 'react';
import { getQuantityInText } from 'Utilities/Utilities';
import { CellRendererParams, RowClassParams } from '../../Add_Update/OutgoingGrid.d';
import './../../../../Components/AgGridComponent/StyleSpeficier/StyleSpecifier.css';
import {IOutgoingShipmentAddDetail,IOutgoingShipmentUpdateDetail} from 'Types/DTO.d';

export function ProductCellRenderer(params: CellRendererParams<IOutgoingShipmentAddDetail['ProductId']>) {
    return params.data.Observer.GetProducts().find(e => e.Id === params.data.Shipment.ProductId)?.Title ?? '--';
}
export const FlavourCellRenderer = SelectWithAriaRenderer<CellRendererParams<IOutgoingShipmentAddDetail['FlavourId']>>
    (e => e.data.Observer.GetFlavours().map(e => ({ label: e.Title, value: e.Id })), (e) => e.data.Shipment.FlavourId !== -1);

export const CustomPriceRenderer = (params: CellRendererParams<IOutgoingShipmentUpdateDetail['CustomCaratPrices']>) => {
    return QuantityWithPriceCellRenderer((params: CellRendererParams<number>) => params.data.Shipment.CustomCaratPrices.TotalQuantity, (params: CellRendererParams<number>) => params.data.Shipment.CustomCaratPrices.TotalPrice, (params: CellRendererParams<number>) => params.data.Shipment.CaretSize)(params);
}
export const QuantityWithPriceCellRenderer = (getQuantityFromParams: (params: ICellRendererParams) => number, getPriceFromParams: (params: ICellRendererParams) => number, getCaretSizeFromParams: (params: ICellRendererParams) => number) => {
    return (params: ICellRendererParams) => {
        const price = getPriceFromParams(params);
        const quantity = getQuantityFromParams(params);
        const caretSize = getCaretSizeFromParams(params);
        return showQuantityAndPrice(getQuantityInText(quantity, caretSize), price);
    }
}
export function showQuantityAndPrice(quantity: string, price: number) {
    return <span className="d-inline-flex flex-column jutify-content-center align-items-center">
        <span>{quantity}</span>
        <span>{price}</span>
    </span>
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
};