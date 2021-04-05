import { AxiosResponse } from 'axios';
import IShopService from 'Contracts/Services/IShopService';
import { Shop } from 'Types/DTO';
import { ShopClient } from 'HttpClient/Axios';
import MockAdapter from 'axios-mock-adapter';
import { Shops } from 'Mock/Shop';

const mocking = new MockAdapter(ShopClient,{delayResponse:5000});
mocking.onGet('api/shop/getbyname').reply(200, Shops);

export default class ShopService implements IShopService {
	GetByName(name: string): Promise<AxiosResponse<Shop[]>> {
		return ShopClient.get('/getbyname', { data: { name } });
	}
}
