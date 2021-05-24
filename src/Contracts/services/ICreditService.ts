import { AxiosPromise } from "axios";
import {  CreditDTO, CreditInfoDTO } from "Types/DTO";

export default interface ICreditService {
    Add(Credit: CreditDTO): AxiosPromise<CreditDTO>;
    GetCreditLog(shipmentId: number, shopId: number): AxiosPromise<CreditInfoDTO>;
}