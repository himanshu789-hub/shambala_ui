
import { OutgoingStatus } from 'Enums/Enum';
import {  OutgoingShipment} from './Types';

export type OutgoingShipmentDetails = {
	Id: number;
	OutgoingShipmentDetail: OutgoingShipment;
	Products: Product[];
	Status:OutgoingStatus;
};
export type PostOutgoingShipment = {
	DateCreated:Date,
    OutgoingShipmentDetails:IShipmentElement[];
	SalesmanId:number;
}
export type IShipmentElement = {
	Id: number;
	ProductId: number;
	TotalRecivedPieces: number;
	CaretSize: number;
	TotalDefectedPieces: number;
	FlavourId: number;
};
export type SalesmanDTO = 
{
  Id:number;
  FullName:string;
  
}




export type Flavour = {
	Id: number;
	Title: string;
	Quantity?: number;
};
export type Product = {
	Id: number;
	Name: string;
	CaretSize: number;
	Flavours: Flavour[];
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
	FlavourId: number;
	Quantity: number;
	CaretSize: number;
};
export type ShopInvoice = {
	ShopId: number | undefined;
	SchemeId: number | undefined;
	Invoices: SoldItem[];
};
export type ProductInfo  =
{
	Id:number;
	Name:string;
	Flavours:Flavour[];
}
export type Shop = {
	Id: number;
	Name: string;
	Address: string;
	IsWithPredinedScheme: boolean;
	Scheme: Scheme;
};
