import { AxiosPromise } from "axios";
import {  CreditDTO, CreditLeftOver, InvoiceCreditInfoDTO } from "Types/DTO";

export default interface ICreditService {
    Add(Credit: CreditDTO): AxiosPromise<CreditDTO>;
    GetCreditInfo(shipmentId: number, shopId: number):AxiosPromise<InvoiceCreditInfoDTO>;
    GetCreditLeftByShopIds(credits:CreditLeftOver[]):AxiosPromise<CreditLeftOver[]>;
}