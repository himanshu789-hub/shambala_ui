import axios, { AxiosRequestConfig } from 'axios';

const BaseUrl = '/api';
const AxiosConfig:AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' } };
const ProductAxiosClient = axios.create({ baseURL: BaseUrl+'/product'});
const OutgoingShipmentClient = axios.create({baseURL:BaseUrl+'/outgoingShipment',...AxiosConfig}) ;
export { ProductAxiosClient,OutgoingShipmentClient };
