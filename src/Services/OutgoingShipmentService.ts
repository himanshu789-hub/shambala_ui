import { AxiosResponse } from 'axios';
import IOutgoingShipment from 'Contracts/services/IOutgoingShipmentService';
import { OutgoingShipmentValue, OutgoingShipmentProducts } from 'Mock/Shipment';
import MockAdapter from 'axios-mock-adapter';
import { OutgoingShipmentClient } from 'HttpClient/Axios';
import { IShipmentElement, OutgoingShipmentDetails, PostOutgoingShipment } from 'Types/DTO';
import { OutgoingShipment } from 'Types/Types';

const mock = new MockAdapter(OutgoingShipmentClient, { delayResponse: 1000 });
mock.onGet(/\/outgoing\/getbyid/i).reply(200, OutgoingShipmentProducts);
mock.onGet(/\/outgoing\/search/i).reply(200, OutgoingShipmentValue);
export default class OutgoingService implements IOutgoingShipment {
	PostOutgoingShipmentWithProductList(OutgoingShipmentPost: PostOutgoingShipment): Promise<AxiosResponse<void>> {
		return OutgoingShipmentClient.post('/addasync', { ...OutgoingShipmentPost });
	}
	GetShipmentProductDetailsById(Id: number): Promise<AxiosResponse<OutgoingShipmentDetails>> {
		return OutgoingShipmentClient.get('getById');
	}
	GetShipmentByDateAndSalesmanId(SalesmanId: number, Date: string): Promise<AxiosResponse<OutgoingShipment[]>> {
		return OutgoingShipmentClient.get('search');
	}
}
