import Loader, { CallStatus } from "Components/Loader/Loader";
import { ChangeEvent, useEffect, useState } from "react";
import { SalesmanService } from "Services/SalesmanService";
import { SalesmanDTO } from "Types/DTO";

type SalesmanListProps = {
    handleSelection(Id: number): void;
    SalemanId: number;
}
export default function SalesmanList(props: SalesmanListProps) {
    const [Salesmans, SetSalesmans] = useState<SalesmanDTO[]>([]);
    const [SalesmanStatus, SetSalemsnStatus] = useState<{ ApiStatus: CallStatus, Message?: string }>({ ApiStatus: CallStatus.EMPTY, Message: '' });
    const { SalemanId } = props;
    useEffect(() => {
        SetSalemsnStatus({ ApiStatus: CallStatus.LOADING, Message: 'Fetching Salesman List' });
        new SalesmanService()
            .GetAll()
            .then(res => {
                SetSalesmans(res.data);
                SetSalemsnStatus({ ApiStatus: CallStatus.LOADED, Message: '' });
            }).catch(res => SetSalemsnStatus({ Message: undefined, ApiStatus: CallStatus.ERROR }));
    }, [])
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { handleSelection } = props;
        const { value } = e.currentTarget;
        const SalesmanSelected = Number.parseInt(value);
        handleSelection(SalesmanSelected);
    }
    return (<Loader Status={SalesmanStatus.ApiStatus} Message={SalesmanStatus.Message}>
        <div className='input-group mr-2'>
            <div className='input-group-prepend'>
                <div className='input-group-text'>Salesman</div>
            </div>

            <select className='form-control' name='SalesmanId' onChange={handleChange} value={SalemanId}>
                <option disabled value='-1'>
                    --Select A Salesman--
        </option>
                {Salesmans.map(e => (
                    <option value={e.Id} key={e.Id}>{e.FullName}</option>
                ))}
            </select>
        </div></Loader>);

}