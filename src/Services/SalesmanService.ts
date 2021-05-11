import { AxiosResponse } from "axios";
import ISalesmanService from "Contracts/services/ISalesmanService";
import { SalesmanDTO } from "Types/DTO";
import { SalesmanClient } from 'HttpClient/Axios';
export class SalesmanService implements ISalesmanService {
    GetAll(): Promise<AxiosResponse<SalesmanDTO[]>> {
        return SalesmanClient.get('/getall');
    }

}