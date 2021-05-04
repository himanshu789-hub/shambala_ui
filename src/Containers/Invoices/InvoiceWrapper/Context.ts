import React from "react";
import Observer from "Utilities/Observer";

export type InvoiceContextType = {
	// HandleChange(subscriptionId: number, componentId: number, name: string, value: any): void;
	// HandleComponentDelete(subscriptionId:number,componentId:number):void;
	// HandleShopOrSchemeChange(subscriptionId: number, name: string, value: any): void;
	// AddASoldItem(subscriptionId: number): void;
	GetObserverBySubscriberAndComponentId(subscriptionId:number,componentId:number):Observer;
}

export const InvoiceContext = React.createContext<Partial<InvoiceContextType>>({});
