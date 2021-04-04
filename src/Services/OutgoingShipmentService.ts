import { AxiosResponse } from 'axios';
import IOutgoingShipment from 'Contracts/Services/IOutgoingShipmentService';
import { OutgoingShipmentValue, OutgoingShipmentProducts } from 'Mock/Shipment';
import MockAdapter from 'axios-mock-adapter';
import { OutgoingShipmentClient } from 'HttpClient/Axios';
import {OutgoingShipment,OutgoingShipmentDetails} from 'Types/types';

const mock = new MockAdapter(OutgoingShipmentClient, { delayResponse: 3000 });
mock.onGet(/\/outgoingshipment\/\d/i).reply(200, OutgoingShipmentProducts);
mock.onGet(/\/outgoingshipment\/search/i).reply(200, OutgoingShipmentValue);
export default class OutgoingService implements IOutgoingShipment {
	GetShipmentDetailsById(Id: number): Promise<AxiosResponse<OutgoingShipmentDetails>> {
		return OutgoingShipmentClient.get('getById/1');
	}
	GetShipmentByDateAndSalesmanId(SalesmanId: number, Date: string): Promise<AxiosResponse<OutgoingShipment[]>> {
		return OutgoingShipmentClient.get('search');
	}
}
