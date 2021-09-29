import { AxiosPromise, AxiosResponse } from 'axios';
import {  OutgoingShipmentInfo, OutgoingShipmentPut, OutgoingShipmentView, PostOutgoingShipment,ResutModel } from 'Types/DTO';
import { OutgoingShipment,} from 'Types/DTO';
export default interface IOutgoingShipmentService {
	GetShipmentByDateAndSalesmanId(SalesmanId: number, Date: Date): Promise<AxiosResponse<OutgoingShipmentInfo[]>>;
	Add(OutgoingShipmentPost: PostOutgoingShipment): Promise<AxiosResponse<OutgoingShipment>>;
	GetById(Id: number): Promise<AxiosResponse<OutgoingShipmentInfo>>;
	UpdateOutgoingShipment(Shipment: OutgoingShipmentPut): AxiosPromise<boolean>;
	GetDetails(Id:number):AxiosPromise<OutgoingShipmentView>;
}