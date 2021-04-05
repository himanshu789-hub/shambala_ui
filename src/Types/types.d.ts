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
	Id:number;
	SchemeType:number;
}

export type OutgoingShipment = {
	Id: number;
	DateCreated: string;
	Salesman: SalesmanProperties;
	Status: number;
};
type CaretDetails = {
	Id: number;
	CaretSize: number;
};
export type IShipmentElement = {
	Id: number;
	ProductId: number;
	TotalRecivedPieces: number;
	CaretSize: number;
	TotalDefectedPieces: number;
	FlavourId: number;
};

type Flavour = {
	Id: number;
	Title: string;
	Quantity?: number;
};
export type Product = {
	Id: number;
	Name: string;
	Carets: CaretDetails[];
	Flavour: Flavour[];
};
