import axios, { AxiosResponse } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import IProductService from 'Contracts/services/IProductService';
import { ProductAxiosClient as AxiosClient, ProductAxiosClient } from 'HttpClient/Axios';
import { IShipmentElement, Product } from 'Types/DTO';
import {productsWithLimit,productsWithoutLimit} from 'Mock/Product';

const mock  = new MockAdapter(ProductAxiosClient);
mock.onGet(/\/api\/product\/getallwithlimit/i).reply(200,productsWithLimit);
mock.onGet(/\/api\/product\/getallwithoutlimit/i).reply(200,productsWithoutLimit);

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
