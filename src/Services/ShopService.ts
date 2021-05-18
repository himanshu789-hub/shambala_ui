import { AxiosResponse } from 'axios';
import IShopService from 'Contracts/services/IShopService';
import { IShopDTO, IShopInfoDTO } from 'Types/DTO';
import { ShopClient } from 'HttpClient/Axios';
import GenericService from './GenericService';

export default class ShopService extends GenericService<IShopDTO> implements IShopService {
	constructor() {
		super(ShopClient)
	} 
	IsNameAlreadyExists(name: string): Promise<AxiosResponse<boolean>> {
		return ShopClient.get('/IsNameAlreadyExists', { params: { name } });
	};

	GetByName(name: string): Promise<AxiosResponse<IShopInfoDTO[]>> {
		return ShopClient.get('/getallbyname', { params: { name } });
	}
}
