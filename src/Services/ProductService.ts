import axios, { AxiosResponse } from 'axios';
import IProductService from 'Contracts/services/IProductService';
import { Product } from 'Types/Product';
import { products } from 'Mock/Product';
import MockAdapter from 'axios-mock-adapter';

const AxiosClient = axios.create({ baseURL: '/', headers: { 'Content-Type': 'application/json' } });

let mock = new MockAdapter(AxiosClient);

mock.onGet('/products').reply(200, products );

export default class ProductService implements IProductService {
	setErrorHandler = (callBack: () => void) => callBack();

	GetAll(): Promise<AxiosResponse<Product[]>> {
		return AxiosClient.get('products');
	}
}
