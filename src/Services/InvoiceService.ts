import { AxiosPromise } from "axios";
import IInvoiceService from "Contracts/services/IInvoiceService";
import { InvoiceStatus } from "Enums/Enum";
import { InvoiceBillingDTO, InvoiceCreditInfoDTO, InvoiceDetailDTO } from "Types/DTO";
import { InvoiceClient } from "HttpClient/Axios";

export default class InvoiceService implements IInvoiceService {
    GetInvoiceDetailWithCreditLog(shopId: number, shipmentId: number): AxiosPromise<InvoiceCreditInfoDTO> {
        return InvoiceClient.get('/GetInvoiceWithCreditLog',{params:{shopId,shipmentId}});    }
    GetInvoiceBill(shopId: number, shipmentId: number): AxiosPromise<InvoiceBillingDTO> {
        return InvoiceClient.get('/GetInvoiceBill',{params:{shopId,shipmentId}});
    }
    GetInvoiceDetail(shopId: number, page: number, status?: InvoiceStatus, date?: Date): AxiosPromise<InvoiceDetailDTO[]> {
        let param: any = { shopId, page }
        if (status)
            param = { ...param, status };
        if (date)
            param = { ...param, date };
        return InvoiceClient.get('/getinvoicedetail', { params: param });
    }

}