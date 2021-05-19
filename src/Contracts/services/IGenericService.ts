import { AxiosResponse } from "axios";

export default interface IGenericService<T> {
     GetAllByName(name:string):Promise<AxiosResponse<T[]>>;
     Add(Entity: T): Promise<AxiosResponse<void>>;
     GetById(Id: Number): Promise<AxiosResponse<T>>;
     Update(Entity: T): Promise<AxiosResponse<void>>;
     IsNameExists(Nam: string, Id?: number): Promise<AxiosResponse<boolean>>;
}