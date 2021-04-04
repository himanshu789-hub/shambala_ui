import {AxiosResponse} from 'axios';
import {OutgoingShipment, OutgoingShipmentDetails} from 'Types/types';

export default interface IOutgoingService {
	GetShipmentDetailsById(Id: number): Promise<AxiosResponse<OutgoingShipmentDetails>>;
	GetShipmentByDateAndSalesmanId(SalesmanId:number,Date:string): Promise<AxiosResponse<OutgoingShipment[]>>;
} 