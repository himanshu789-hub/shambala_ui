import SalesmanList from "Components/SalesmanList/SalesmanList";
import React, { useState } from "react";
import { OutgoingShipmentInfo } from "Types/DTO";
import { EmptyTableBody } from 'Components/Miscellaneous/Miscellaneous';
import { OutgoingStatus } from "Enums/Enum";
import OutgoingService from "Services/OutgoingShipmentService";
import Loader, { ApiStatusInfo, CallStatus } from "Components/Loader/Loader";
import { Link } from "react-router-dom";

export default function Search() {
    const [salesmanId, setSalesmanId] = useState<number>(-1);
    const [date, setDate] = useState<string>(new Date().toISOString());
    const [list, setList] = useState<OutgoingShipmentInfo[]>();
    const [apiStatus, setApiStatus] = useState<ApiStatusInfo>({ Status: CallStatus.EMPTY });
    function handleSalesmanSelect(Id: number) {
        setSalesmanId(() => Id);
    }
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { currentTarget: { value } } = e;
        setDate(() => value);
    }
    function IsValid() {
        let isValid = true;
        if (salesmanId == -1)
            isValid = false;
        return isValid;
    }
    const handleClick = function () {
        if (IsValid()) {
            setApiStatus({ Status: CallStatus.LOADING, Message: "Gathering List" });
            new OutgoingService().GetShipmentByDateAndSalesmanId(salesmanId, new Date(date))
                .then(res => {
                    setList(res.data);
                })
                .catch(e => setApiStatus({ Status: CallStatus.ERROR }));
        }
        else
            alert('Please, Fill Form Properly');
    }
    return (<div>
        <div className="form-inline">
            <SalesmanList handleSelection={handleSalesmanSelect} SalemanId={salesmanId}></SalesmanList>
            <div className="form-group">
                <span>Date</span>
                <input className="form-control" value={date} onChange={handleChange} />
            </div>
            <button className="btn btn-success" onClick={handleClick}>Go</button>
        </div>

        <Loader Status={apiStatus.Status} Message={apiStatus.Message}>
            <div className="table-wrapper">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>S.No.</th>
                            <th>Date Created</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            list && list.length ?
                                list!.map((e, index) => (<tr>
                                    <td>{index + 1}</td>
                                    <td>{new Date(e.DateCreated).toLocaleDateString()}</td>
                                    <td><span className="badge">{Object.entries(OutgoingStatus).find((i) => i[1] == e.Status)?.[0]}</span></td>
                                    <td>[<Link to={`/outgoing/${e.Id}`}/>,{e.Status==OutgoingStatus.FILLED?(<Link to={`/outgoing/view/${e.Id}`}/>):""}]</td>
                                </tr>)) : (<EmptyTableBody numberOfColumns={3} />)
                        }
                    </tbody>
                </table>
            </div>
        </Loader>
    </div>);
}