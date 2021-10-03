import { AxiosPromise } from "axios";
import { LedgerClient } from "HttpClient/Axios";
import { LedgerDTO } from "Types/DTO";

export interface ILedgerService {
    Post(ledger: LedgerDTO): AxiosPromise
}
export class LedgerService implements ILedgerService {

    Post(ledger: LedgerDTO): AxiosPromise<any> {
        return LedgerClient.post('/add', ledger);
    }

}