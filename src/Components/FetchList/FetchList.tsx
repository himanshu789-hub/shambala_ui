import React, { ReactNode, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { SalesmanService } from "Services/SalesmanService";
import ShopService from "Services/ShopService";
import { SalesmanDTO } from "Types/DTO";

type FetchListPorps<T> = {
    fetchAllByName: Promise<T[]>;
    Component: React.ComponentType<{ data: T[] }>;
}
function FetchList<T>(props: FetchListPorps<T>) {
    const [data, setData] = useState<T[]>([]);
    useEffect(() => {
        props.fetchAllByName
            .then((data) => setData(data));
    }, []);
    return <div>
        <div className="search d-flex justify-content-center">

        </div>
        <props.Component data={data} />
    </div>;
}
const ShowSalesmanList = (props: { data: SalesmanDTO[] }) => {
    return <div className="table-wrapper">
        <table>
            <thead>
                <th>
                    <td>S.No</td>
                    <td>FullName</td>
                    <td>Action</td>
                </th>
            </thead>
            <tbody>
                {props.data.map((e, index) => <tr>
                    <td>{index + 1}</td>
                    <td>{e.FullName}</td>
                    <td><Link to={`/salesman/upate/${e.Id}`}> <i className="fa fa-pen"></i></Link></td>
                </tr>)}
            </tbody>
        </table>
    </div>;
}

export function SalesmanList() {
    const fetchsalesmans = new SalesmanService().GetAll().then(res => res.data);
    const SalesmanfetchListProps: FetchListPorps<SalesmanDTO> = { fetchAllByName: fetchsalesmans, Component: ShowSalesmanList };
    return <FetchList {...SalesmanfetchListProps}></FetchList>
}