import {AxiosResponse} from 'axios';
import {ShipmentDTO,Product, ProductInfo} from 'Types/DTO';
export default interface IProductService {
	Add(shipment:ShipmentDTO[]):Promise<AxiosResponse<void>>;
	GetProductWithoutLimit(): Promise<AxiosResponse<Product[]>>;
	GetProductWithLimit():Promise<AxiosResponse<Product[]>>;
	GetProductById(ProductId:number):Promise<AxiosResponse<ProductInfo>>;
}
