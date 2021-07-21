import { AxiosPromise, AxiosResponse } from 'axios';
import IOutgoingShipment from 'Contracts/services/IOutgoingShipmentService';
import { OutgoingShipmentClient } from 'HttpClient/Axios';
import { ShipmentDTO, OutgoingShipmentInfo, PostOutgoingShipment, ShopInvoice, IOutgoingShipmentLedgerWithOldDebit, LedgerStatus, IOutgoingShipmentLedger, OutgoingShipmentCompleteDetail, OutgoingShipmentPriceDetail } from 'Types/DTO';
import { OutgoingShipment, OutgingReturnDTO } from 'Types/DTO';

export default class OutgoingService implements IOutgoingShipment {
	GetOutgoingShipmentPriceDetailById(Id: number): AxiosPromise<OutgoingShipmentPriceDetail> {
		return OutgoingShipmentClient.get('/getpricedetailbyid');
	}
	UpdateOutgoingShipment(Id: number, Shipment: PostOutgoingShipment): AxiosPromise<boolean> {
		return OutgoingShipmentClient.put('/update' + Id, Shipment);
	}

	CheckShipmentAmount(ledgers: IOutgoingShipmentLedger[]): AxiosPromise<LedgerStatus> {
		return OutgoingShipmentClient.post('/checkamount', ledgers);
	}
	GetById(Id: number): Promise<AxiosResponse<OutgoingShipment>> {
		return OutgoingShipmentClient.get('/getbyId', { params: { Id } });
	}
	Complete(Id: number, ledgers: IOutgoingShipmentLedgerWithOldDebit[]): Promise<AxiosResponse<boolean>> {
		const outgoingShipmentLedger: OutgoingShipmentCompleteDetail = { DateCreated: new Date(), Id: Id, Ledgers: ledgers };

		return OutgoingShipmentClient.post(`/complete/${Id}`, outgoingShipmentLedger);
	}
	Return(Id: number, shipments: ShipmentDTO[]): Promise<AxiosResponse<void>> {
		const returnShipments = shipments.map(e => {
			const shipment: OutgingReturnDTO = { FlavourId: e.FlavourId, ProductId: e.ProductId, TotalQuantityReturned: e.TotalRecievedPieces, TotalQuantityDefected: e.TotalDefectedPieces };
			return shipment;
		});
		return OutgoingShipmentClient.put(`/Return/${Id}`, returnShipments);
	}
	PostOutgoingShipmentWithProductList(OutgoingShipmentPost: PostOutgoingShipment): Promise<AxiosResponse<void>> {
		return OutgoingShipmentClient.post('/add', OutgoingShipmentPost);
	}
	GetShipmentProductDetailsById(Id: number): Promise<AxiosResponse<OutgoingShipmentInfo>> {
		return OutgoingShipmentClient.get(`/GetProductListByOrderId/${Id}`);
	}
	GetShipmentByDateAndSalesmanId(SalesmanId: number, Date: Date): Promise<AxiosResponse<OutgoingShipment[]>> {
		return OutgoingShipmentClient.get('/GetOutgoingBySalesmanIdAndDate', { params: { SalesmanId, Date: Date } });
	}
}
