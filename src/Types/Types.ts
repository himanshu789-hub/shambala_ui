import { SalesmanModal } from "Models/Salesman";
import { SalesmanDTO } from "./DTO";

export type ShipmentProperty = {
	Id: number;
	Name: string;
	Value: any;
};
export type ProductKeyWithName = {
	Id: number;
	Name: string;
};
export type SalesmanProperties = {
	Id: number;
	FirstName: string;
	LastName: string;
};
export type ChoosenScheme = {
	Id: number;
	SchemeType: number;
}

export type OutgoingShipment = {
	Id: number;
	DateCreated: string;
	Salesman: SalesmanDTO;
	Status: number;
};
export type CaretDetails = {
	Id: number;
	CaretSize: number;
};
