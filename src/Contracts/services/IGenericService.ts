import { AxiosResponse } from "axios";

export default interface IGenericService<T>{
     GetById(Id:Number):Promise<AxiosResponse<T>>;
}