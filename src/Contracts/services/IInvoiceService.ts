import { AxiosPromise } from "axios";
import { InvoiceStatus } from "Enums/Enum";
import { InvoiceDetailDTO } from "Types/DTO";

export default interface IInvoiceService {
  GetInvoiceDetail(shopId:number,page:number,status?:InvoiceStatus,date?:Date):AxiosPromise<InvoiceDetailDTO[]>;
}