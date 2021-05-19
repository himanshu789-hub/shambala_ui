import { AxiosResponse } from "axios";
import { SalesmanDTO } from "Types/DTO";
import IGenericService from "./IGenericService";

export default interface ISalesmanService extends IGenericService<SalesmanDTO>
{
    GetAll():Promise<AxiosResponse<SalesmanDTO[]>>;
}