import axios, { AxiosResponse } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import IProductService from 'Contracts/services/IProductService';
import { ProductAxiosClient as AxiosClient, ProductAxiosClient } from 'HttpClient/Axios';
import { IShipmentElement, Product, ProductInfo } from 'Types/DTO';
import {productsWithLimit,productsWithoutLimit} from 'Mock/Product';

const mock  = new MockAdapter(ProductAxiosClient);
mock.onGet(/\/api\/product\/getallwithlimit/i).reply(200,productsWithLimit);
mock.onGet(/\/api\/product\/getallwithoutlimit/i).reply(200,productsWithoutLimit);
mock.onGet(/\/api\/product\/getproductbyid/i)
export default class ProductService implements IProductService {
	GetProductById(ProductId:number): Promise<AxiosResponse<ProductInfo>> {
		return ProductAxiosClient.get('/getproductbyid');
	}
	Add(shipment: IShipmentElement[]): Promise<AxiosResponse<void>> {
		return ProductAxiosClient.post('/add', shipment);
	}
    GetProductWithLimit():Promise<AxiosResponse<Product[]>>{
       return ProductAxiosClient.get('/GetAllWithLimit');
	}           
	GetProductWithoutLimit(): Promise<AxiosResponse<Product[]>> {
		return AxiosClient.get('/GetAllWithoutLimit');
	}
}
