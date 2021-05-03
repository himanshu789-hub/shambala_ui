import {AxiosResponse} from 'axios';
import {IShipmentElement, OutgoingShipmentDetails, PostOutgoingShipment} from 'Types/DTO';
import { OutgoingShipment } from 'Types/Types';
export default interface IOutgoingService {
	GetShipmentProductDetailsById(Id: number): Promise<AxiosResponse<OutgoingShipmentDetails>>;
	GetShipmentByDateAndSalesmanId(SalesmanId:number,Date:string): Promise<AxiosResponse<OutgoingShipment[]>>;
	PostOutgoingShipmentWithProductList(OutgoingShipmentPost:PostOutgoingShipment):Promise<AxiosResponse<void>>;
} 