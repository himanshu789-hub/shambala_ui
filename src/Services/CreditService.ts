import { AxiosPromise } from "axios";
import ICreditService from "Contracts/services/ICreditService";
import { CreditClient } from "HttpClient/Axios";
import { CreditDTO, CreditInfoDTO } from "Types/DTO";


export default class CreditService implements ICreditService {
    Add(Credit: CreditDTO): AxiosPromise<CreditDTO> {
        return CreditClient.post("/add",Credit);
    }
    GetCreditLog(shipmentId: number, shopId: number): AxiosPromise<CreditInfoDTO> {
        throw new Error("Method not implemented.");
    }
     
}