import { AxiosResponse } from 'axios';
import IShopService from 'Contracts/services/IShopService';
import { IShopInfoDTO } from 'Types/DTO';
import { ShopClient } from 'HttpClient/Axios';

export default class ShopService implements IShopService {
	GetByName(name: string): Promise<AxiosResponse<IShopInfoDTO[]>> {
		return ShopClient.get('/getallbyname', { params: { name } });
	}
}
