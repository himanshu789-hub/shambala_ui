import { AxiosPromise } from "axios";
import {  CreditDTO, CreditInfoDTO, InvoiceCreditInfoDTO } from "Types/DTO";

export default interface ICreditService {
    Add(Credit: CreditDTO): AxiosPromise<CreditDTO>;
    GetCreditLog(shipmentId: number, shopId: number): AxiosPromise<CreditInfoDTO>;
    GetCreditInfo(shipmentId: number, shopId: number):AxiosPromise<InvoiceCreditInfoDTO>;
}