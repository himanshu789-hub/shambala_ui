import { AxiosPromise, AxiosResponse } from 'axios';
import IOutgoingShipmentService from 'Contracts/services/IOutgoingShipmentService';
import { OutgoingShipmentClient } from 'HttpClient/Axios';
import {  PostOutgoingShipment, ResutModel } from 'Types/DTO';
import { OutgoingShipmentInfo,OutgoingShipment } from 'Types/DTO';

export default class OutgoingService implements IOutgoingShipmentService {
	UpdateOutgoingShipment(Id: number, Shipment: PostOutgoingShipment): AxiosPromise<boolean> {
		return OutgoingShipmentClient.put('/update' + Id, Shipment);
	}
	GetById(Id: number): Promise<AxiosResponse<OutgoingShipmentInfo>> {
		return OutgoingShipmentClient.get('/getbyId', { params: { Id } });
	}
	Add(OutgoingShipmentPost: PostOutgoingShipment): Promise<AxiosResponse<OutgoingShipment>> {
		return OutgoingShipmentClient.post('/add', OutgoingShipmentPost);
	}
	GetShipmentByDateAndSalesmanId(SalesmanId: number, Date: Date): Promise<AxiosResponse<OutgoingShipment[]>> {
		return OutgoingShipmentClient.get('/GetOutgoingBySalesmanIdAndDate', { params: { SalesmanId, Date: Date } });
	}
}
