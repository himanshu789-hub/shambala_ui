import { AxiosPromise, AxiosResponse } from 'axios';
import {  OutgoingShipmentInfo, OutgoingShipmentPut, PostOutgoingShipment,ResutModel } from 'Types/DTO';
import { OutgoingShipment,} from 'Types/DTO';
export default interface IOutgoingShipmentService {
	GetShipmentByDateAndSalesmanId(SalesmanId: number, Date: Date): Promise<AxiosResponse<OutgoingShipment[]>>;
	Add(OutgoingShipmentPost: PostOutgoingShipment): Promise<AxiosResponse<OutgoingShipment>>;
	GetById(Id: number): Promise<AxiosResponse<OutgoingShipmentInfo>>;
	UpdateOutgoingShipment(Shipment: OutgoingShipmentPut): AxiosPromise<boolean>;
}