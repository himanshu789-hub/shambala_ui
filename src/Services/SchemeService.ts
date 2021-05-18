import ISchemeService from 'Contracts/services/ISchemeService';
import { SchemeDTO } from 'Types/DTO';
import { SchemeClient } from 'HttpClient/Axios';
import { AxiosResponse } from 'axios';
import GenericService from './GenericService';

export default class SchemeService extends GenericService<SchemeDTO> implements ISchemeService {
	constructor() {
		super(SchemeClient);
	}
	GetByShopId(shopId: number): Promise<AxiosResponse<SchemeDTO>> {
		return SchemeClient.get(`/getbyshopId/${shopId}`);
	}
	GetAll(): Promise<AxiosResponse<SchemeDTO[]>> {
		return SchemeClient.get('/getall');
	}
}
