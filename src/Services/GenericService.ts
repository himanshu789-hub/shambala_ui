import { AxiosInstance, AxiosResponse } from "axios";
import IGenericService from "Contracts/services/IGenericService";

export default abstract class GenericService<T> implements IGenericService<T> {
    Client: AxiosInstance;
    constructor(axios: AxiosInstance) {
        this.Client = axios;
    }
    GetById(Id: Number): Promise<AxiosResponse<T>> {
        return this.Client.get(`/getbyid/${Id}`);
    }
    Add(Entity: T): Promise<AxiosResponse<void>> {
        return this.Client.post('/add',Entity);
    }
}