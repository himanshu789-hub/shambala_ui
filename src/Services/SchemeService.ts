import ISchemeService from 'Contracts/services/ISchemeService';
import { Scheme } from 'Types/DTO';
import { SchemeClient } from 'HttpClient/Axios';
import { AxiosResponse } from 'axios';
import Mock from 'axios-mock-adapter';
import {AllMockScheme} from 'Mock/Scheme';

const mock = new Mock(SchemeClient,{delayResponse:4000});
mock.onGet(/\/api\/scheme\/getbyshopId/i).reply(200,AllMockScheme[2]);
mock.onGet('api/scheme/getall').reply(200, AllMockScheme);

export default class SchemeService implements ISchemeService {
	GetByShopId(shopId: number): Promise<AxiosResponse<Scheme>> {
		return SchemeClient.get(`/getbyshopId/${shopId}`);
	}
	GetAll(): Promise<AxiosResponse<Scheme[]>> {
		return SchemeClient.get('/getall');
	}
}
