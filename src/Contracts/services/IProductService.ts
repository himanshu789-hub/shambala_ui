import {Product} from 'Types/Types';
import {AxiosResponse} from 'axios';

export default interface IProductService {
	GetAll: () => Promise<AxiosResponse<Product[]>>;
	GetProductWithLimit(): Promise<AxiosResponse<Product[]>>
}
