import { AxiosPromise, AxiosResponse } from 'axios';
import { ShipmentDTO, OutgoingShipmentInfo, PostOutgoingShipment, ShopInvoice, LedgerStatus, IOutgoingShipmentLedger, OutgoingShipmentPriceDetail } from 'Types/DTO';
import { OutgoingShipment, IOutgoingShipmentLedgerWithOldDebit } from 'Types/DTO';
export default interface IOutgoingShipmentService {
	GetShipmentProductDetailsById(Id: number): Promise<AxiosResponse<OutgoingShipmentInfo>>;
	GetShipmentByDateAndSalesmanId(SalesmanId: number, Date: Date): Promise<AxiosResponse<OutgoingShipment[]>>;
	PostOutgoingShipmentWithProductList(OutgoingShipmentPost: PostOutgoingShipment): Promise<AxiosResponse<void>>;
	Return(Id: number, shipments: ShipmentDTO[]): Promise<AxiosResponse<void>>;
	Complete(Id: number, ledger: IOutgoingShipmentLedgerWithOldDebit[]): Promise<AxiosResponse<boolean>>;
	CheckShipmentAmount(ledgers: IOutgoingShipmentLedger[]): AxiosPromise<LedgerStatus>;
	GetById(Id: number): Promise<AxiosResponse<OutgoingShipment>>;
	UpdateOutgoingShipment(Id: number, Shipment: PostOutgoingShipment): AxiosPromise<boolean>;
	GetOutgoingShipmentPriceDetailById(Id: number): AxiosPromise<OutgoingShipmentPriceDetail>;
}