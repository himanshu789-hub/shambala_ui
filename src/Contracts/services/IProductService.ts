import {AxiosResponse} from 'axios';
import {ShipmentDTO,Product, ProductInfo} from 'Types/DTO';
export default interface IProductService {
	Add(shipment:ShipmentDTO[]):Promise<AxiosResponse<void>>;
	GetAll(): Promise<AxiosResponse<Product[]>>;
	GetProductById(ProductId:number):Promise<AxiosResponse<ProductInfo>>;
}
