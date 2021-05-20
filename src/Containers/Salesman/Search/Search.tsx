import { Link } from "react-router-dom";
import { SalesmanService } from "Services/SalesmanService";
import { SalesmanDTO } from "Types/DTO";
import FetchList from 'Containers/FetchList/FetchList';
import { EmptyTableBody, Heading } from "Components/Miscellaneous/Miscellaneous";

const ShowSalesmanList = (props: { data: SalesmanDTO[] }) => {
    return <div className="table-wrapper">
        <table>
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>FullName</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {props.data.length > 0 ? props.data.map((e, index) => <tr>
                    <td>{index + 1}</td>
                    <td>{e.FullName}</td>
                    <td className="p-1"><Link to={`/salesman/update/${e.Id}`} className="bg-info text-white"> <i className="fa fa-pencil"></i>Edit</Link></td>
                </tr>) : <EmptyTableBody numberOfColumns={3}/>}
            </tbody>
        </table>
    </div>;
}
const S = new SalesmanService();
export default function SalesmanSearchList() {
    const endPoint = S.GetAllByName.bind(S);
    return <div>
        <Heading label="Search A Salesman" />
        <FetchList<SalesmanDTO> fetchAllByName={endPoint} render={(data) => <ShowSalesmanList data={data} />} />
    </div>
}