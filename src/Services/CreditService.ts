import { AxiosPromise } from "axios";
import ICreditService from "Contracts/services/ICreditService";
import { CreditClient } from "HttpClient/Axios";
import { CreditDTO, CreditInfoDTO, InvoiceCreditInfoDTO } from "Types/DTO";


export default class CreditService implements ICreditService {
    GetCreditInfo(shipmentId: number, shopId: number): AxiosPromise<InvoiceCreditInfoDTO> {
        throw new Error("Method not implemented.");
    }
    Add(Credit: CreditDTO): AxiosPromise<CreditDTO> {
        return CreditClient.post("/add",Credit);
    }
    GetCreditLog(shipmentId: number, shopId: number): AxiosPromise<CreditInfoDTO> {
        throw new Error("Method not implemented.");
    }
     
}