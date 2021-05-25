import {AxiosResponse} from 'axios';
import {ShipmentDTO, OutgoingShipmentInfo, PostOutgoingShipment, ShopInvoice} from 'Types/DTO';
import { OutgoingShipment } from 'Types/DTO';
export default interface IOutgoingService {
	GetShipmentProductDetailsById(Id: number): Promise<AxiosResponse<OutgoingShipmentInfo>>;
	GetShipmentByDateAndSalesmanId(SalesmanId:number,Date:Date): Promise<AxiosResponse<OutgoingShipment[]>>;
	PostOutgoingShipmentWithProductList(OutgoingShipmentPost:PostOutgoingShipment):Promise<AxiosResponse<void>>;
	Return(Id:number,shipments:ShipmentDTO[]):Promise<AxiosResponse<void>>;
	Complete(Id:number,invoices:ShopInvoice[]):Promise<AxiosResponse<void>>;
} 