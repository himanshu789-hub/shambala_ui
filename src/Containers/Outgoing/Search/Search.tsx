import SalesmanList from "Components/SalesmanList/SalesmanList";
import React, { useState } from "react";
import { OutgoingShipmentInfo } from "Types/DTO";
import { EmptyTableBody } from 'Components/Miscellaneous/Miscellaneous';
import { OutgoingStatus } from "Enums/Enum";
import OutgoingService from "Services/OutgoingShipmentService";
import Loader, { ApiStatusInfo, CallStatus } from "Components/Loader/Loader";
import { Link, NavLink } from "react-router-dom";
import { Heading } from 'Components/Miscellaneous/Miscellaneous';

type ErrorMesages = {
    SalesmanId: string;
}
export default function Search() {
    const [salesmanId, setSalesmanId] = useState<number>(-1);
    const [date, setDate] = useState<string>(new Date().toISOString().substring(0, 10));
    const [list, setList] = useState<OutgoingShipmentInfo[]>();
    const [apiStatus, setApiStatus] = useState<ApiStatusInfo>({ Status: CallStatus.EMPTY });
    const [errorMessage, setErrorMessage] = useState<ErrorMesages>();
    function handleSalesmanSelect(Id: number) {
        setSalesmanId(() => Id);
    }
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { currentTarget: { value } } = e;
        setDate(() => value);
    }
    function IsValid() {
        let isValid = true;
        const msg: ErrorMesages = {
            SalesmanId: ''
        }
        if (salesmanId == -1) {
            isValid = false;
            msg.SalesmanId = "Salesman Required";
        }
        setErrorMessage(msg);
        return isValid;
    }
    const handleClick = function () {
        if (IsValid()) {
            setApiStatus({ Status: CallStatus.LOADING, Message: "Gathering List" });
            new OutgoingService().GetShipmentByDateAndSalesmanId(salesmanId, new Date(date))
                .then(res => {
                    setList(res.data);
                    setApiStatus({ Status: CallStatus.LOADED });
                })
                .catch(e => setApiStatus({ Status: CallStatus.ERROR }));
        }
    }
    return (<div>
        <Heading label="Search A Shipment" />
        <div className="form-row justify-content-center">
            <div className="form-group">
                <SalesmanList handleSelection={handleSalesmanSelect} SalemanId={salesmanId}></SalesmanList>
                <span className="form-text text-danger error-text">{errorMessage?.SalesmanId}</span>
            </div>

            <div className="ml-1 form-group">
                <span className="input-group mr-sm-2">
                    <span className="input-group-prepend">
                        <span className="input-group-text">Date</span>
                    </span>
                    <input className="form-control" type="date" value={date} onChange={handleChange} />
                </span>
            </div>
            <div className="form-group">
                <button className="ml-4 btn btn-success" onClick={handleClick}>Go</button>
            </div>

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
                                    <td><span className={`badge ${e.Status===OutgoingStatus.PENDING?"badge-warning":"badge-success"}`}>{Object.entries(OutgoingStatus).find((i) => i[1] == e.Status)?.[0]}</span></td>
                                    <td>{[<NavLink className="btn btn-warning text-white fa fa-edit" to={`/outgoing/add/${e.Id}`} >Edit</NavLink>,e.Status == OutgoingStatus.FILLED ? (<NavLink className="btn btn-info" to={`/outgoing/view/${e.Id}`} >View</NavLink>) : ""]}</td>
                                </tr>)) : (<EmptyTableBody numberOfColumns={4} />)
                        }
                    </tbody>
                </table>
            </div>
        </Loader>
    </div>);
}