import { AxiosResponse } from 'axios';
import IOutgoingShipment from 'Contracts/services/IOutgoingShipmentService';
import { OutgoingShipmentClient } from 'HttpClient/Axios';
import { ShipmentDTO, OutgoingShipmentInfo, PostOutgoingShipment, ShopInvoice } from 'Types/DTO';
import { OutgoingShipment } from 'Types/DTO';

// const mock = new MockAdapter(OutgoingShipmentClient, { delayResponse: 1000 });
// mock.onGet(/\/outgoing\/getbyid/i).reply(200, OutgoingShipmentProducts);
// mock.onGet(/\/outgoing\/search/i).reply(200, OutgoingShipmentValue);

export default class OutgoingService implements IOutgoingShipment {
	Complete(Id: number, invoices: ShopInvoice[]): Promise<AxiosResponse<void>> {
		var data = invoices.map(e=>{return {...e,DateCreated:new Date()}});
		return OutgoingShipmentClient.post(`/complete/${Id}`,data);
	}
	Return(Id: number, shipments: ShipmentDTO[]): Promise<AxiosResponse<void>> {
       return OutgoingShipmentClient.put(`/Return/${Id}`,shipments);
	}
	PostOutgoingShipmentWithProductList(OutgoingShipmentPost: PostOutgoingShipment): Promise<AxiosResponse<void>> {
		return OutgoingShipmentClient.post('/add', OutgoingShipmentPost );
	}
	GetShipmentProductDetailsById(Id: number): Promise<AxiosResponse<OutgoingShipmentInfo>> {
		return OutgoingShipmentClient.get(`/GetProductListByOrderId/${Id}`);
	}
	GetShipmentByDateAndSalesmanId(SalesmanId: number, Date: Date): Promise<AxiosResponse<OutgoingShipment[]>> {
		return OutgoingShipmentClient.get('/GetOutgoingBySalesmanIdAndDate',{params:{SalesmanId,Date:Date}});
	}
}
