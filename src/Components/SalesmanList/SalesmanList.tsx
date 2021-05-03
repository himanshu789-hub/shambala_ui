import { ChangeEvent, useState } from "react";
import { SalesmanDTO } from "Types/DTO";

type SalesmanListProps = {
    handleSelection(Id: number): void;
    Salesmans: SalesmanDTO[];
}
export default function SalesmanList(props: SalesmanListProps) {
    const [salesmanId, setSalesman] = useState(-1);
    const { Salesmans } = props;

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { handleSelection } = props;
        const { value } = e.currentTarget;
        const SalesmanSelected = Number.parseInt(value);
        setSalesman(SalesmanSelected)
        handleSelection(SalesmanSelected);
    }
    return <div className='input-group mr-2'>
        <div className='input-group-prepend'>
            <div className='input-group-text'>Salesman</div>
        </div>
        <select className='form-control' name='SalesmanId' onChange={handleChange} value={salesmanId}>
            <option disabled selected value='-1'>
                --Select A Salesman--
        </option>
            {Salesmans.map(e => (
                <option value={e.Id} key={e.Id}>{e.FullName}</option>
            ))}
        </select>
    </div>;

}