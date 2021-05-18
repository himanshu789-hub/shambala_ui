import { AxiosResponse } from 'axios';
import { SchemeDTO } from 'Types/DTO';
import IGenericService from './IGenericService';

export default interface ISchemeService extends IGenericService<SchemeDTO>{
   GetByShopId(shopId: number): Promise<AxiosResponse<SchemeDTO>>;
   GetAll(): Promise<AxiosResponse<SchemeDTO[]>>;
}