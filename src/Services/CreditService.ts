import { AxiosPromise } from "axios";
import ICreditService from "Contracts/services/ICreditService";
import { CreditClient } from "HttpClient/Axios";
import { CreditDTO,  CreditLeftOver,  InvoiceCreditInfoDTO } from "Types/DTO";


export default class CreditService implements ICreditService {
    GetCreditLeftByShopIds(credits:CreditLeftOver[]): AxiosPromise<CreditLeftOver[]> {
        return CreditClient.post('/getleftover',credits);
    }
    GetCreditInfo(shipmentId: number, shopId: number): AxiosPromise<InvoiceCreditInfoDTO> {
        throw new Error("Method not implemented.");
    }
    Add(Credit: CreditDTO): AxiosPromise<CreditDTO> {
        return CreditClient.post("/add",Credit);
    }
    
}