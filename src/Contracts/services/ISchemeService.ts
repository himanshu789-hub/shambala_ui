import { AxiosResponse } from 'axios';
import { Scheme } from 'Types/DTO';

export default interface ISchemeService {
   GetByShopId(shopId: number): Promise<AxiosResponse<Scheme>>;
   GetAll(): Promise<AxiosResponse<Scheme[]>>;
}