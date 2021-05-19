import { AxiosResponse } from "axios";
import ISalesmanService from "Contracts/services/ISalesmanService";
import { SalesmanDTO } from "Types/DTO";
import { SalesmanClient } from 'HttpClient/Axios';
import GenericService from "./GenericService";
export class SalesmanService extends GenericService<SalesmanDTO> implements ISalesmanService {
    constructor() {
        super(SalesmanClient);
    }
    GetAll(): Promise<AxiosResponse<SalesmanDTO[]>> {
        return SalesmanClient.get('/getall');
    }

}