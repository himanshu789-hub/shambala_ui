
import {  OutgoingShipment, Product } from './Types';

export type OutgoingShipmentDetails = {
	Id: number;
	OutgoingShipmentDetail: OutgoingShipment;
	Products: Product[];
};

export type Scheme = {
	Id: number;
	Name: string;
	Date: string;
	IsUserDefinedScheme: boolean;
	SchemeType: number;
	Value: number;
};

export type SoldItem = {
	Id: number;
	ProductId: number;
	FlavouId: number;
	Quantity: number;
	CaretSize: number;
};
export type ShopInvoice = {
	ShopId: number | undefined;
	SchemeId: number | undefined;
	Invoices: SoldItem[];
};
export type Shop = {
	Id: number;
	Name: string;
	Address: string;
	IsWithPredinedScheme: boolean;
	Scheme: Scheme;
};
