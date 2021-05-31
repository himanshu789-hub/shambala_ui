import { AxiosPromise } from "axios";
import { InvoiceStatus } from "Enums/Enum";
import { IInvoiceBillingDTO, InvoiceCreditInfoDTO, InvoiceDetailDTO } from "Types/DTO";

export default interface IInvoiceService {
  GetInvoiceDetail(shopId:number,page:number,status?:InvoiceStatus,date?:Date):AxiosPromise<InvoiceDetailDTO[]>;
  GetInvoiceBill(shopId:number,shipmentId:number):AxiosPromise<IInvoiceBillingDTO>;
  GetInvoiceDetailWithCreditLog(shopId:number,shipmentId:number):AxiosPromise<InvoiceCreditInfoDTO>;
}