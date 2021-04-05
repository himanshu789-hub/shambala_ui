import { AxiosResponse } from "axios";
import { Shop } from "Types/DTO";

export default interface IShopService {
    GetByName(name:string):Promise<AxiosResponse<Shop[]>>;
}