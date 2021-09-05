import { AxiosPromise, AxiosResponse } from 'axios';
import {  OutgoingShipmentInfo, PostOutgoingShipment,ResutModel } from 'Types/DTO';
import { OutgoingShipment,} from 'Types/DTO';
export default interface IOutgoingShipmentService {
	GetShipmentByDateAndSalesmanId(SalesmanId: number, Date: Date): Promise<AxiosResponse<OutgoingShipment[]>>;
	Add(OutgoingShipmentPost: PostOutgoingShipment): Promise<AxiosResponse<OutgoingShipment>>;
	GetById(Id: number): Promise<AxiosResponse<OutgoingShipmentInfo>>;
	UpdateOutgoingShipment(Id: number, Shipment: PostOutgoingShipment): AxiosPromise<boolean>;
}