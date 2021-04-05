import {AxiosResponse} from 'axios';
import {OutgoingShipment} from 'Types/Types';
import {OutgoingShipmentDetails} from 'Types/DTO';
export default interface IOutgoingService {
	GetShipmentDetailsById(Id: number): Promise<AxiosResponse<OutgoingShipmentDetails>>;
	GetShipmentByDateAndSalesmanId(SalesmanId:number,Date:string): Promise<AxiosResponse<OutgoingShipment[]>>;
} 