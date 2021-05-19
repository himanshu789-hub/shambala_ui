import { AxiosInstance, AxiosResponse } from "axios";
import IGenericService from "Contracts/services/IGenericService";

export default abstract class GenericService<T> implements IGenericService<T> {
    Client: AxiosInstance;
    constructor(axios: AxiosInstance) {
        this.Client = axios;
    }
    GetAllByName(name: string): Promise<AxiosResponse<T[]>> {
        return this.Client.get("/getallbyname", { params: { name } });
    }
    IsNameExists(Name: string, Id?: number): Promise<AxiosResponse<boolean>> {
        let url = "/IsNameAlreadyExists";
        if (Id)
            url += "/" + Id;
        return this.Client.get(url, { params: { Name } });
    }
    Update(Shop: T): Promise<AxiosResponse<void>> {
        return this.Client.put("/update", Shop);
    }
    GetById(Id: Number): Promise<AxiosResponse<T>> {
        return this.Client.get(`/getbyid/${Id}`);
    }
    Add(Entity: T): Promise<AxiosResponse<void>> {
        return this.Client.post('/add', Entity);
    }
}