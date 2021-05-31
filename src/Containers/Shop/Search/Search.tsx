import { Link } from "react-router-dom";
import { IShopDTO } from "Types/DTO";
import FetchList from 'Containers/FetchList/FetchList';
import { EmptyTableBody, Heading } from "Components/Miscellaneous/Miscellaneous";
import ShopService from "Services/ShopService";

const ShowShopList = (props: { data: IShopDTO[] }) => {
    return <div className="table-wrapper">
        <table className="table">
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>FullName</th>
                    <th>Address</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {props.data.length > 0 ? props.data.map((e, index) => <tr>
                    <td>{index + 1}</td>
                    <td>{e.Title}</td>
                    <td>{e.Address}</td>
                    <td><Link to={`/shop/update/${e.Id}`} className="bg-info text-white p-2 rounded"> <i className="fa fa-pencil"></i> Edit</Link></td>
                </tr>) : <EmptyTableBody numberOfColumns={4}/>}
            </tbody>
        </table>
    </div>;
}

const ShopSer = new ShopService();
const endPoint = ShopSer.GetAllByName.bind(ShopSer);
export default function ShopSearchList() {

    return <div>
        <Heading label="Search A Shop" />
        <FetchList<IShopDTO> fetchAllByName={endPoint} render={(data) => <ShowShopList data={data} />} />
    </div>;
}