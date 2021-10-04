import React from "react";
import queryString from 'query-string';
import { useLocation } from "react-router";

export interface IInvoice_QueryString_Props {
    ShopId: number;
    ShipmentId: number;
};
type InvoiceWrapper = {
    Component: React.ComponentType<IInvoice_QueryString_Props>
}
export function Invoice_QueryString_HOC(props: InvoiceWrapper) {

    return function QueryStringComponent () {
        const location = useLocation();
        const parse = queryString.parse(location.search);
        const { Component } = props;
        const shopId = parse.shopId + '';
        const shipmentId = parse.shipmentId + '';
        if (shipmentId && Number.parseInt(shipmentId + '') && shopId && Number.parseInt(shopId + ''))
            return <Component ShopId={Number.parseInt(shopId)} ShipmentId={Number.parseInt(shipmentId)} />

        return <label>Not Proper Query String</label>;
    }
}