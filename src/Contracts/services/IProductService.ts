import {AxiosResponse} from 'axios';
import {IShipmentElement,Product} from 'Types/DTO';
export default interface IProductService {
	Add(shipment:IShipmentElement[]):Promise<AxiosResponse<void>>;
	GetProductWithoutLimit(): Promise<AxiosResponse<Product[]>>;
	GetProductWithLimit():Promise<AxiosResponse<Product[]>>
}
