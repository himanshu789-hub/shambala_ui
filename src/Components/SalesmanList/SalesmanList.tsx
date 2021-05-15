import Loader, { CallStatus } from "Components/Loader/Loader";
import { ChangeEvent, useEffect, useState } from "react";
import { SalesmanService } from "Services/SalesmanService";
import { SalesmanDTO } from "Types/DTO";

type SalesmanListProps = {
    handleSelection(Id: number): void;
    SalemanId: number;
}
export default function SalesmanList(props: SalesmanListProps) {
    const [salesmans, setSalesmans] = useState<SalesmanDTO[]>([]);
    const [salesmanRequestInfo, setSalesmanRequestInfo] = useState<{ ApiStatus: CallStatus, Message?: string }>({ ApiStatus: CallStatus.EMPTY, Message: '' });
    const { SalemanId } = props;
    useEffect(() => {
        setSalesmanRequestInfo({ ApiStatus: CallStatus.LOADING, Message: 'Fetching Salesman List' });
        new SalesmanService()
            .GetAll()
            .then(res => {
                setSalesmanRequestInfo({ ApiStatus: CallStatus.LOADED, Message: '' });
                setSalesmans(res.data);
            }).catch(() => setSalesmanRequestInfo({ Message: undefined, ApiStatus: CallStatus.ERROR }));
    },[])
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { handleSelection } = props;
        const { value } = e.currentTarget;
        const SalesmanSelected = Number.parseInt(value);
        handleSelection(SalesmanSelected);
    }
    return (<Loader Status={salesmanRequestInfo.ApiStatus} Message={salesmanRequestInfo.Message}>
        <div className='input-group mr-2'>
            <div className='input-group-prepend'>
                <div className='input-group-text'>Salesman</div>
            </div>

            <select className='form-control' name='SalesmanId' onChange={handleChange} value={SalemanId}>
                <option disabled value='-1'>
                    --Select A Salesman--
        </option>
                {salesmans.map(e => (
                    <option value={e.Id} key={e.Id}>{e.FullName}</option>
                ))}
            </select>
        </div></Loader>);

}