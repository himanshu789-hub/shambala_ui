import { AxiosResponse } from "axios";
import { IShopDTO, IShopInfoDTO } from "Types/DTO";
import IGenericService from "./IGenericService";

export default interface IShopService extends IGenericService<IShopDTO> {
    IsNameAlreadyExists(name:string):Promise<AxiosResponse<boolean>>;
}