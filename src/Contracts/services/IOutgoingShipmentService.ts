import {AxiosResponse} from 'axios';
import {ShipmentDTO, OutgoingShipmentDetails, PostOutgoingShipment, ShopInvoice} from 'Types/DTO';
import { OutgoingShipment } from 'Types/Types';
export default interface IOutgoingService {
	GetShipmentProductDetailsById(Id: number): Promise<AxiosResponse<OutgoingShipmentDetails>>;
	GetShipmentByDateAndSalesmanId(SalesmanId:number,Date:Date): Promise<AxiosResponse<OutgoingShipment[]>>;
	PostOutgoingShipmentWithProductList(OutgoingShipmentPost:PostOutgoingShipment):Promise<AxiosResponse<void>>;
	Return(Id:number,shipments:ShipmentDTO[]):Promise<AxiosResponse<void>>;
	Complete(Id:number,invoices:ShopInvoice[]):Promise<AxiosResponse<void>>;
} 