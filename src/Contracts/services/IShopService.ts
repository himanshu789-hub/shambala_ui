import { AxiosResponse } from "axios";
import { IShopInfoDTO } from "Types/DTO";

export default interface IShopService {
    GetByName(name:string):Promise<AxiosResponse<IShopInfoDTO[]>>;
}