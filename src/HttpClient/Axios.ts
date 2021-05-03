import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

const BaseUrl = 'https://localhost:5001/api';
const AxiosConfig: AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' } };

axios.interceptors.response.use((response) => response, (error: AxiosError) => {
    console.error(error.toJSON());
    return error;
});

const ProductAxiosClient = axios.create({ baseURL: BaseUrl + '/product', ...AxiosConfig });
const OutgoingShipmentClient = axios.create({ baseURL: BaseUrl + '/outgoingshipment', ...AxiosConfig });
const SchemeClient = axios.create({ baseURL: BaseUrl + '/scheme', ...AxiosConfig });
const ShopClient = axios.create({ baseURL: BaseUrl + '/shop', ...AxiosConfig });
const SalesmanClient = axios.create({baseURL:BaseUrl+'/salesman',...AxiosConfig});
export { ProductAxiosClient, OutgoingShipmentClient, SchemeClient, ShopClient,SalesmanClient };
