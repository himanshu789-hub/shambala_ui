import { OutgoingStatus, SchemeKey } from 'Enums/Enum';

type OutgoingShipmentPriceDetail = {
	Id: number;
	Salesman: SalesmanDTO;
	ProductDetails: OutgoingShipmentProductDetail[];
}
type OutgoingShipmentProductDetail = {
	ProductId: number;
	Name: string;
	FlavourDetails: OutgoingShipmentFlavourDetail[];
}
type OutgoingShipmentFlavourDetail = {
	FlavourId: number;
	Name: string;
	VariantDetails: FlavourVariantDetail[];
	SchemeDetail: FlavourSchemeDetail;
}
type Element = {
	ProductId: number;
	FlavourId: number;
}
type FlavourVariantDetail = {
	Quantity: number;
	TotalPrice: number;
	PricePerCarat: number;
}
type FlavourSchemeDetail = {
	TotalPrice: number;
	Quantity: number;
	PricePerBottle: number;
}
interface OutgoingShipment {
	Id: number;
	RowVersion: number;
	DateCreated: string;
	OutgoingShipmentDetails: IOutgoingShipmentUpdateDetail[];
};
type LedgerDetailDTO = {
	OldCheque: number;
	NewCheque: number;
	TotalOldCheque: number;
	TotalNewCheque: number;
	OldCash: number;
}
type LedgerDTO = LedgerDetailDTO & {
	OutgoingShipmentId: number;
	RowVersion: number;
	NetPrice: number;
}
type CreditAndNetHolderDTO = {
	Type: number;
	Amount: number;
	Qty: number;
	Medium: number;
}
type CreditDebitDTO = {
	Ledgers: CreditAndNetHolderDTO[];
	RowVersion: number;
	OutgoingShipmentId: number;
}
type OutgoingShipmentView = {
	Id: number;
	Salesman: SalesmanDTO;
	Status: number;
	OutgoingShipmentDetails: IAggregateDetailDTO[];
	TotalSchemePrice: number;
	TotalSchemeQuantity: number;
	TotalShipedPrice: number;
	TotalNetPrice: number;
	CustomCaratTotalPrice: number;
	RowVersion: number;
	Ledger:number | nulls;
}
interface IAggregateDetailDTO extends IOutgoingShipmentUpdateDetail {
	CaretSize: number;
	UnitPrice: number;
	ProductName: string;
	FlavourName: string;
}
interface OutgoingShipmentPost {
	SalesmanId: number;
	DateCreated: string;
	Shipments: ShipmentDTO[];
}
interface OutgoingShipmentPut extends OutgoingShipment {
	SalesmanId: number;
}
interface OutgoingShipmentInfo extends OutgoingShipment {
	Salesman: SalesmanDTO;
	Status: number;
}

interface IOutgoingShipmentAddDetail {
	Id: number;
	ProductId: number;
	FlavourId: number;
	TotalQuantityTaken: number;
	TotalQuantityRejected: number;
	CaretSize: number;
	TotalQuantityReturned: number;
}

type SchemeInfo = {
	TotalSchemePrice: number;
	SchemeQuantity: number;
	TotalQuantity: number;
}
type CustomCaratPrice = {
	Prices: CustomPrice[];
	TotalPrice: number;
	TotalQuantity: number
}
interface IOutgoingShipmentUpdateDetail extends IOutgoingShipmentAddDetail {
	SchemeInfo: SchemeInfo;
	TotalQuantityShiped: number;
	CustomCaratPrices: CustomCaratPrice;
	NetPrice: number;
	TotalShipedPrice: number;
}

type CustomPrice = {
	Id: number;
	Quantity: number;
	PricePerCarat: number;
}

type OutgoingShipmentCompleteDetail = {
	DateCreated: Date;
	Id: number;
	Ledgers: IOutgoingShipmentLedgerWithOldDebit[]
}
type PostOutgoingShipment = {
	DateCreated: Date,
	Shipments: ShipmentDTO[];
	SalesmanId: number;
}
type ShipmentDTO = {
	Id: number;
	ProductId: number;
	TotalRecievedPieces: number;
	CaretSize: number;
	TotalDefectedPieces: number;
	FlavourId: number;
};
type SalesmanDTO =
	{
		Id: number;
		FullName: string;
	}
type OutOfStock = { ProductId: number, FlavourId: number, Quantity: number; }
type BadRequestError =
	{
		Code: number;
		Model: any;
	}
type Flavour = {
	Id: number;
	Title: string;
	Quantity: number;
};
type FlavourInfo =
	{
		Id: number;
		Title: string;
		QuantityInStock: number;
		QuantityInDispatch: number;
	}
type Product = {
	Id: number;
	Name: string;
	CaretSize: number;
	Flavours: Flavour[];
	PricePerCaret: number;
	SchemeQuantity?: number;
	PricePerBottle: number;
};

type SchemeDTO = {
	Id: number;
	Title: string;
	Date: string;
	IsUserDefinedScheme: boolean;
	SchemeType: SchemeKey;
	Value: number;
};

type SoldItem = {
	Id: number;
	ProductId: number;
	FlavourId: number;
	Quantity: number;
	CaretSize: number;
};
type ShopInvoice = {
	ShopId: number | undefined;
	SchemeId: number | null;
	Invoices: SoldItem[];
	DateCreated: Date;
	OutgoingShipmentId: number;
};
type ProductInfo =
	{
		Id: number;
		Name: string;
		CaretSize: number;
		FlavourInfos: FlavourInfo[];
	}
interface IShopBaseDTO {
	Id: number;
	Title: string;
	Address: string;
}
interface IShopDTO extends IShopBaseDTO {
	SchemeId: number | null;
}
interface IShopInfoDTO extends IShopBaseDTO {
	Scheme: SchemeDTO;
};
type InvoiceDetailDTO = {
	OutgoingShipmentId: number;
	ShopId: number;
	DateCreated: string;
	TotalCostPrice: number;
	TotalSellingPrice: number;
	Scheme?: SchemeDTO;
	TotalDuePrice: number;
	IsCompleted: boolean;
}
type ResutModel = {
	IsValid: boolean;
	Content: Object;
	Code: number;
	Name: string;
}
type BillInfo = {
	ProductName: string;
	FlavourName: string;
	QuantityPurchase: number;
	SellingPrice: number;
	CaretSize: number;
}
interface IInvoiceBillingDTO extends InvoiceDetailDTO {
	Shop: IShopDTO;
	OutgoingShipment: OutgoingShipment;
	DateCreated: string;
	BillingInfo: BillInfo[];
}
type LedgerStatus = {
	Result: boolean;
	TotalShipmentPrice: number;
	YourTotal: number;
}
type CreditDTO = {
	OutgoingShipmentId: number;
	ShopId: number;
	Id: number;
	Amount: number;
	DateRecieved: string;
}
type CreditLeftOver = {
	ShopId: number;
	Credit: number;
}

type InvoiceCreditInfoDTO = {
	Shop: IShopDTO;
	OutgoingShipment: OutgoingShipmentInfo;
	Credits: CreditDTO[];
	TotalDuePrice: number;
	IsCompleted: boolean;
}
interface IOutgoingShipmentLedger {
	ShopId: number;
	Credit: number;
	Debit: number;
}
interface IOutgoingShipmentLedgerWithOldDebit extends IOutgoingShipmentLedger {

	OldDebit: number;
}
