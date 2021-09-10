import axios, { AxiosResponse } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import IProductService from 'Contracts/services/IProductService';
import { ProductAxiosClient as AxiosClient, ProductAxiosClient } from 'HttpClient/Axios';
import { ShipmentDTO, ProductInfo, Product } from 'Types/DTO';

// const mock = new MockAdapter(ProductAxiosClient,{delayResponse:1000});
// mock.onGet(/\/api\/product\/getallwithlimit/i).reply(200, productsWithLimit);
// mock.onGet(/\/api\/product\/getallwithoutlimit/i).reply(200, productsWithoutLimit);
// const ProductInfoReply: ProductInfo = { Flavours: [{Id:1,QuantityInProcrument:100,QuantityInStock:2232,Title:"Orange"}], Id: productsWithLimit[0].Id, Name: productsWithLimit[0].Name,CaretSize:30 };
// mock.onGet(/\/api\/product\/getproductbyid/i).reply(200,ProductInfoReply);

export default class ProductService implements IProductService {

	GetProductById(ProductId: number): Promise<AxiosResponse<ProductInfo>> {
		return ProductAxiosClient.get(`/GetProductByIdWithStockAndDispatch/${ProductId}`);
	}
	Add(shipment: ShipmentDTO[]): Promise<AxiosResponse<void>> {
		return ProductAxiosClient.post('/add', shipment);
	}
	GetAll(date?: string): Promise<AxiosResponse<Product[]>> {
		return ProductAxiosClient.get('/GetAll', { params: { date } });
	}
}
