import { AxiosResponse } from 'axios';
import IOutgoingShipment from 'Contracts/services/IOutgoingShipmentService';
import { OutgoingShipmentValue, OutgoingShipmentProducts } from 'Mock/Shipment';
import MockAdapter from 'axios-mock-adapter';
import { OutgoingShipmentClient } from 'HttpClient/Axios';
import { ShipmentDTO, OutgoingShipmentDetails, PostOutgoingShipment, ShopInvoice } from 'Types/DTO';
import { OutgoingShipment } from 'Types/Types';

// const mock = new MockAdapter(OutgoingShipmentClient, { delayResponse: 1000 });
// mock.onGet(/\/outgoing\/getbyid/i).reply(200, OutgoingShipmentProducts);
// mock.onGet(/\/outgoing\/search/i).reply(200, OutgoingShipmentValue);

export default class OutgoingService implements IOutgoingShipment {
	Complete(Id: number, invoices: ShopInvoice[]): Promise<AxiosResponse<void>> {
		return OutgoingShipmentClient.put(`/complete/${Id}`,invoices);
	}
	Return(Id: number, shipments: ShipmentDTO[]): Promise<AxiosResponse<void>> {
       return OutgoingShipmentClient.put(`/Return/${Id}`,shipments);
	}
	PostOutgoingShipmentWithProductList(OutgoingShipmentPost: PostOutgoingShipment): Promise<AxiosResponse<void>> {
		return OutgoingShipmentClient.post('/add', OutgoingShipmentPost );
	}
	GetShipmentProductDetailsById(Id: number): Promise<AxiosResponse<OutgoingShipmentDetails>> {
		return OutgoingShipmentClient.get(`/GetProductListByOrderId/${Id}`);
	}
	GetShipmentByDateAndSalesmanId(SalesmanId: number, Date: Date): Promise<AxiosResponse<OutgoingShipment[]>> {
		return OutgoingShipmentClient.get('/GetOutgoingBySalesmanIdAndDate',{data:{SalesmanId,Date:Date.toUTCString()}});
	}
}
