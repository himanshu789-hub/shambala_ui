import {Product} from 'Types/Product';
import {AxiosResponse} from 'axios';

export default interface IProductService {
    GetAll:()=> Promise<AxiosResponse<Product[]>>,
}
