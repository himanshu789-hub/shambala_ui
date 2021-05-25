import { OutgoingStatus } from "Enums/Enum";
import { Link } from "react-router-dom";
import { OutgoingShipment } from "Types/DTO";

type TableWrapperProps = {
    OutgoingShipments: OutgoingShipment[]
}
function OutgoingStatusButton(props: { Id: number, Status: OutgoingStatus }) {
    const { Status } = props;
    if (Status == OutgoingStatus.PENDING || Status == OutgoingStatus.RETURNED) {
        const IsPending = Status == OutgoingStatus.PENDING;
        const link = IsPending ? `/outgoing/return/${props.Id}` : `/invoice/add/${props.Id}`;
        const label = IsPending ? "Click To Proceed To Return" : "Click To Proceed To Complete";
        return (<span className='form-group'>
            <Link to={link} className={`action text-white ${IsPending ? "bg-info" : "bg-warning"}`}>
                {IsPending ? "Pending" : "Return"}
            </Link>
            <small className='form-text text-muted'>{label}</small>
        </span>);
    }
    else
        return (<label className='badge badge-success'>Completed</label>);
}
function NoItem() {
    return <div className="d-flex justify-content-center align-items-center flex-column no-item-svg-holder">
        <img height="260px" src="/empty.svg"/>
        <label className="font-weight-bold text-danger">Not Found</label>
        </div>;
}
export default function TableWrapper(props: TableWrapperProps) {
    const { OutgoingShipments } = props;
    if (!(OutgoingShipments.length > 0)) {
        return <NoItem />;
    }
    return <div className='table-wrapper'>
        <table>
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>Salesman Name</th>
                    <th>Date</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {OutgoingShipments &&
                    OutgoingShipments.map((value, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{value.Salesman.FullName}</td>
                                <td>{value.DateCreated.substring(0, 10)}</td>
                                <td>
                                    <OutgoingStatusButton Status={value.Status} Id={value.Id} />
                                </td>
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    </div>;
}