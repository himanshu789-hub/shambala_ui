import ISchemeService from 'Contracts/services/ISchemeService';
import { Scheme } from 'Types/DTO';
import { SchemeClient } from 'HttpClient/Axios';
import { AxiosResponse } from 'axios';

export default class SchemeService implements ISchemeService {
	GetByShopId(shopId: number): Promise<AxiosResponse<Scheme>> {
		return SchemeClient.get(`/getbyshopId/${shopId}`);
	}
	GetAll(): Promise<AxiosResponse<Scheme[]>> {
		return SchemeClient.get('/getall');
	}
}
