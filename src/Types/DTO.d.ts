import { OutgoingStatus, SchemeKey } from 'Enums/Enum';
import { NumberLiteralType } from 'typescript';

export type OutgoingShipmentPriceDetail = {
	Id: number;
	Salesman: SalesmanDTO;
	ProductDetails: OutgoingShipmentProductDetail[];
}
export type OutgoingShipmentProductDetail = {
	ProductId: number;
	Name: string;
	FlavourDetails: OutgoingShipmentFlavourDetail[];
}
export type OutgoingShipmentFlavourDetail = {
	FlavourId: number;
	Name: string;
	VariantDetails: FlavourVariantDetail[];
	SchemeDetail: FlavourSchemeDetail;
}
export type FlavourVariantDetail = {
	Quantity: number;
	TotalPrice: number;
	PricePerCarat: number;
}
export type FlavourSchemeDetail = {
	TotalPrice: number;
	Quantity: number;
	PricePerBottle: number;
}
export type OutgoingShipment = {
	Id: number;
	DateCreated: string;
	Salesman: SalesmanDTO;
	Status: number;
	OutgoingShipmentDetails: IOutgoingShipmentAddDetail[];
};
export interface IOutgoingShipmentAddDetail {
	Id: number;
	ProductId: number;
	FlavourId: number;
	TotalQuantityShiped: number;
	TotalQuantityRejected: number;
	CaretSize: number;
	TotalQuantityReturned: number;
}
export interface IOutgoingShipmentUpdateDetail extends IOutgoingShipmentAddDetail {
	SchemePrice: number;
	TotalQuantitySale: number;
	TotalSchemeQuantity: nunber;
	CustomPrices: CustomPrice[];
}
export type CustomPrice = {
	Id: number;
	Quantity: number;
	Price: number;
}
export type OutgoingShipmentInfo = {
	Id: number;
	Products: Product[];
	Salesman: SalesmanDTO;
	Status: OutgoingStatus;
};
export type OutgoingShipmentCompleteDetail = {
	DateCreated: Date;
	Id: number;
	Ledgers: IOutgoingShipmentLedgerWithOldDebit[]
}
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

export type SchemeDTO = {
	Id: number;
	Title: string;
	Date: string;
	IsUserDefinedScheme: boolean;
	SchemeType: SchemeKey;
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
	SchemeId: number | null;
	Invoices: SoldItem[];
	DateCreated: Date;
	OutgoingShipmentId: number;
};
export type ProductInfo =
	{
		Id: number;
		Name: string;
		CaretSize: number;
		FlavourInfos: FlavourInfo[];
	}
export interface IShopBaseDTO {
	Id: number;
	Title: string;
	Address: string;
}
export interface IShopDTO extends IShopBaseDTO {
	SchemeId: number | null;
}
export interface IShopInfoDTO extends IShopBaseDTO {
	Scheme: SchemeDTO;
};
export type InvoiceDetailDTO = {
	OutgoingShipmentId: number;
	ShopId: number;
	DateCreated: string;
	TotalCostPrice: number;
	TotalSellingPrice: number;
	Scheme?: SchemeDTO;
	TotalDuePrice: number;
	IsCompleted: boolean;
}
type BillInfo = {
	ProductName: string;
	FlavourName: string;
	QuantityPurchase: number;
	SellingPrice: number;
	CaretSize: number;
}
export interface IInvoiceBillingDTO extends InvoiceDetailDTO {
	Shop: IShopDTO;
	OutgoingShipment: OutgoingShipment;
	DateCreated: string;
	BillingInfo: BillInfo[];
}
export type LedgerStatus = {
	Result: boolean;
	TotalShipmentPrice: number;
	YourTotal: number;
}
export type CreditDTO = {
	OutgoingShipmentId: number;
	ShopId: number;
	Id: number;
	Amount: number;
	DateRecieved: string;
}
export type CreditLeftOver = {
	ShopId: number;
	Credit: number;
}

export type InvoiceCreditInfoDTO = {
	Shop: IShopDTO;
	OutgoingShipment: OutgoingShipment;
	Credits: CreditDTO[];
	TotalDuePrice: number;
	IsCompleted: boolean;
}
export interface IOutgoingShipmentLedger {
	ShopId: number;
	Credit: number;
	Debit: number;
}
export interface IOutgoingShipmentLedgerWithOldDebit extends IOutgoingShipmentLedger {

	OldDebit: number;
}
export type OutgingReturnDTO =
	{
		ProductId: number;
		FlavourId: number;
		TotalQuantityReturned: number;
		TotalQuantityDefected: number;
	}