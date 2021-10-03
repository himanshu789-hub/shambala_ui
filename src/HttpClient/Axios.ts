import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

const BaseUrl = '/api';
const AxiosConfig: AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' } };

const createAxiosInstance = (baseUrl: string): AxiosInstance=>{
    const instance = axios.create({ baseURL: baseUrl, ...AxiosConfig });
    instance.interceptors.response.use((response) => response, (error: AxiosError) => {
        console.error("Axios Error Requesting : ", error.response);
        return Promise.reject(error);
    });
    return instance;
}


const ProductAxiosClient = createAxiosInstance(BaseUrl + '/product');

const OutgoingShipmentClient = createAxiosInstance(BaseUrl + '/shipment');
const SchemeClient = createAxiosInstance(BaseUrl + '/scheme');
const ShopClient = createAxiosInstance(BaseUrl + '/shop');
const SalesmanClient = createAxiosInstance(BaseUrl + '/salesman');
const InvoiceClient = createAxiosInstance(BaseUrl+'/invoice');
const CreditClient = createAxiosInstance(BaseUrl+'/credit');
const LedgerClient = createAxiosInstance(BaseUrl+'/ledger')
export { ProductAxiosClient, OutgoingShipmentClient, SchemeClient, ShopClient, SalesmanClient,InvoiceClient,CreditClient,LedgerClient };
