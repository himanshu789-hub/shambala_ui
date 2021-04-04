import {Product} from 'Types/types';
import {AxiosResponse} from 'axios';

export default interface IProductService {
	GetAll: () => Promise<AxiosResponse<Product[]>>;
	GetProductWithLimit(): Promise<AxiosResponse<Product[]>>
}
