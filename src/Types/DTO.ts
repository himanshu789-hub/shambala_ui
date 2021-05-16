
import { OutgoingStatus } from 'Enums/Enum';
import { OutgoingShipment } from './Types';

export type OutgoingShipmentInfo = {
	Id: number;
	Products: Product[];
	Salesman:SalesmanDTO;
	Status: OutgoingStatus;
};
export type PostOutgoingShipment = {
	DateCreated: Date,
	Shipments: ShipmentDTO[];
	SalesmanId: number;
}
export type ShipmentDTO = {
	Id: number;
	ProductId: number;
	TotalRecievedPieces: number;
	CaretSize: number;
	TotalDefectedPieces: number;
	FlavourId: number;
};
export type SalesmanDTO =
	{
		Id: number;
		FullName: string;

	}
export type OutOfStock = { ProductId: number, FlavourId: number }
export type BadRequestError =
	{
		Code: number;
		Model: any;
	}
export type Flavour = {
	Id: number;
	Title: string;
	Quantity?: number;
};
export type FlavourInfo =
	{
		Id: number;
		Title: string;
		QuantityInStock: number;
		QuantityInDispatch: number;
	}
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
export type ProductInfo =
	{
		Id: number;
		Name: string;
		CaretSize: number;
		FlavourInfos: FlavourInfo[];
	}
export type Shop = {
	Id: number;
	Title: string;
	Address: string;
	IsWithPredinedScheme: boolean;
	Scheme: Scheme;
};
