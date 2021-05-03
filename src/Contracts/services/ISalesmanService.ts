import { AxiosResponse } from "axios";
import { SalesmanDTO } from "Types/DTO";

export default interface ISalesmanService
{
    GetAll():Promise<AxiosResponse<SalesmanDTO[]>>;
}