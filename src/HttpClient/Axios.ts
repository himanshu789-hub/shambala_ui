import axios, { AxiosRequestConfig } from 'axios';

const BaseUrl = '/api';
const AxiosConfig:AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' } };
const ProductAxiosClient = axios.create({ baseURL: BaseUrl+'/product',...AxiosConfig});
const OutgoingShipmentClient = axios.create({baseURL:BaseUrl+'/outgoing',...AxiosConfig}) ;
const SchemeClient  = axios.create({baseURL:BaseUrl+'/scheme',...AxiosConfig});
const ShopClient = axios.create({baseURL:BaseUrl+'/shop',...AxiosConfig});
export { ProductAxiosClient,OutgoingShipmentClient,SchemeClient ,ShopClient};
