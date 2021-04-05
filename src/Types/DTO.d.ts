import { SchemeType } from 'Enums/Enum';
import { IShipmentElement } from './Types';
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
export type ShopInvoice = {
	ShopId:number,SchemeId:number,Shipments:IShipmentElement[]
}
export type Shop = {
	Id: number;
	Name: string;
	Address: string;
	IsWithPredinedScheme:boolean;
	Scheme:Scheme
};
