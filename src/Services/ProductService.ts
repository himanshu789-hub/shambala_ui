import axios, { AxiosResponse } from 'axios';
import IProductService from 'Contracts/services/IProductService';
import { ProductAxiosClient as AxiosClient } from 'HttpClient/Axios';
import { IShipmentElement, Product } from 'Types/DTO';

export default class ProductService implements IProductService {
	Add(shipment: IShipmentElement[]): Promise<AxiosResponse<void>> {
		return axios.post('add', shipment);
	}
    GetProductWithLimit():Promise<AxiosResponse<Product[]>>
	{
       return axios.get('GetAllWithLimit');
	}           
	GetProductWithoutLimit(): Promise<AxiosResponse<Product[]>> {
		return AxiosClient.get('GetAllWithoutLimit');
	}
}
