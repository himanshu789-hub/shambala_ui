import { AxiosPromise } from "axios";
import IInvoiceService from "Contracts/services/IInvoiceService";
import { InvoiceStatus } from "Enums/Enum";
import { InvoiceBillingDTO, InvoiceDetailDTO } from "Types/DTO";
import { InvoiceClient } from "HttpClient/Axios";

export default class InvoiceService implements IInvoiceService {
    GetInvoices(shopId: number, shipmentId: number): AxiosPromise<InvoiceBillingDTO> {
        throw new Error("Method not implemented.");
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