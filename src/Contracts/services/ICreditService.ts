import { AxiosPromise } from "axios";
import {  CreditDTO, InvoiceCreditInfoDTO } from "Types/DTO";

export default interface ICreditService {
    Add(Credit: CreditDTO): AxiosPromise<CreditDTO>;
    GetCreditInfo(shipmentId: number, shopId: number):AxiosPromise<InvoiceCreditInfoDTO>;
}