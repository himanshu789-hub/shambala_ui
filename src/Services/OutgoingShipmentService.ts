import { AxiosPromise, AxiosResponse } from 'axios';
import IOutgoingShipmentService from 'Contracts/services/IOutgoingShipmentService';
import { OutgoingShipmentClient } from 'HttpClient/Axios';
import { OutgoingShipmentPut, PostOutgoingShipment, ResutModel } from 'Types/DTO';
import { OutgoingShipmentInfo, OutgoingShipment, OutgoingShipmentView } from 'Types/DTO';

export default class OutgoingService implements IOutgoingShipmentService {
	UpdateOutgoingShipment(Shipment: OutgoingShipmentPut): AxiosPromise<boolean> {

		return OutgoingShipmentClient.put('/update', Shipment);
	}
	GetById(Id: number): Promise<AxiosResponse<OutgoingShipmentInfo>> {
		return OutgoingShipmentClient.get('/getbyId', { params: { Id } });
	}
	Add(OutgoingShipmentPost: PostOutgoingShipment): Promise<AxiosResponse<OutgoingShipment>> {
		return OutgoingShipmentClient.post('/add', OutgoingShipmentPost);
	}
	GetShipmentByDateAndSalesmanId(SalesmanId: number, Date: Date): Promise<AxiosResponse<OutgoingShipmentInfo[]>> {
		return OutgoingShipmentClient.get('/GetOutgoingBySalesmanIdAndDate', { params: { SalesmanId, Date: Date } });
	}
	GetDetails(Id: number): AxiosPromise<OutgoingShipmentView> {
		return OutgoingShipmentClient.get('/GetDetailsById/'+Id);
	}
}
