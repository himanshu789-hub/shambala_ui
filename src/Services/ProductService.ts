import  { AxiosResponse } from 'axios';
import IProductService from 'Contracts/Services/IProductService';
import { Product } from 'Types/types';
import { productsWithLimit, productsWithoutLimit } from 'Mock/Product';
import MockAdapter from 'axios-mock-adapter';
import {ProductAxiosClient as AxiosClient} from 'HttpClient/Axios';

let mock = new MockAdapter(AxiosClient);

mock.onGet('/products').reply(200, productsWithoutLimit);
mock.onGet('/productsLimit').reply(200, productsWithLimit);

export default class ProductService implements IProductService {
	setErrorHandler = (callBack: () => void) => callBack();

	GetAll(): Promise<AxiosResponse<Product[]>> {
		return AxiosClient.get('products');
	}
	GetProductWithLimit(): Promise<AxiosResponse<Product[]>> {
		return AxiosClient.get('productsLimit');
	}
}
