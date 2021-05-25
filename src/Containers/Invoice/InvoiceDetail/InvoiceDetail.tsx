import { AxiosPromise } from "axios";
import Loader, { ApiStatusInfo, CallStatus } from "Components/Loader/Loader";
import { EmptyTableBody, Heading } from "Components/Miscellaneous/Miscellaneous";
import ShopSelector from "Components/ShopSelector/ShopSelector";
import IInvoiceService from "Contracts/services/IInvoiceService";
import { InvoiceStatus, SchemeKey } from "Enums/Enum";
import React from "react";
import { Link } from "react-router-dom";
import InvoiceService from "Services/InvoiceService";
import { InvoiceDetailDTO, SchemeDTO } from "Types/DTO";
import { getValidSchemeValue } from "Utilities/Utilities";
import './InvoiceDetail.css';

type FilterProps = {
    handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void;
    Status?: number;
    Date: string;
    handleSubmit(): void;
}
function Filter(props: FilterProps) {
    const { handleChange } = props;
    return <div className="form-inline d-flex align-items-center p-3">
        <label className="font-weight-bold">Filter By : </label>
        <div className="input-group mb-2 mr-sm-2 ml-2">
            <div className="input-group-prepend">
                <div className="input-group-text">After Date</div>
            </div>
            <input type="date" name="Date" className="form-control" id="inlineFormInputGroupUsername2" value={props.Date} onChange={handleChange} />
        </div>

        <div className="input-group mb-2 mr-sm-2">
            <div className="input-group-prepend">
                <div className="input-group-text">Status</div>
            </div>
            <select name="Status" value={props.Status ?? -1} onChange={props.handleChange}>
                <option value={-1}>None</option>
                <option key={InvoiceStatus.DUE} value={InvoiceStatus.DUE}>DUE</option>
                <option key={InvoiceStatus.COMPLTED} value={InvoiceStatus.COMPLTED}>COMPLETED</option>
            </select>
        </div>

        <button className="btn btn-success mb-2" onClick={props.handleSubmit}>Go</button>
    </div>;
}
function Scheme(scheme?: SchemeDTO) {
    let result = "";
    if (!scheme)
        return "";
    switch (scheme.SchemeType) {
        case SchemeKey.BOTTLE:
            result = scheme.Value + "FREE";
            break;
        case SchemeKey.CARET:
            result = scheme.Value + "FREE";
            break;
        case SchemeKey.PERCENTAGE:
            result = getValidSchemeValue(scheme.SchemeType, scheme.Value) + "% Off";
    }
    return result;
}
function InvoiceDetailTable(props: { data: InvoiceDetailDTO[], page: number }) {
    return <div className="invoice-table mt-4 table-wrapper">
        <table>
            <thead>
                <tr>
                    <td>S.No</td>
                    <td>Date Created</td>
                    <td>Cost Price</td>
                    <td>Scheme</td>
                    <td>Sold Price</td>
                    <td>Due Price</td>
                    <td>View Detail</td>
                </tr>
            </thead>
            <tbody>
                {props.data.length > 0 ?
                    props.data.map((e, index) => <tr>
                        <td>{(props.page - 1) + index + 1}</td>
                        <td>{new Date(e.DateCreated).toDateString()}</td>
                        <td>{e.CostPrice}</td>
                        <td>{Scheme(e.Scheme)}</td>
                        <td>{e.SellingPrice}</td>
                        <td>{e.DuePrice}</td>
                        <td><Link to={`/invoice/bill?shipmentId=${e.OutgoingShipmentId}&shopId=${e.ShopId}`}>View Detail</Link></td>
                    </tr>) :
                    <EmptyTableBody numberOfColumns={7} />}
            </tbody>
        </table>
    </div>
}
type InvoiceDetailProps = {

}
type InvoiceDetailState = {
    ShopId?: number;
    Filter: { Date: string, Status?: number }
    InvocieDetails?: InvoiceDetailDTO[];
    RequestInfo: ApiStatusInfo;
    Page: number;
}
function Pagination(props: { handlePrevious(): void, handleNext(): void, currentPage: number, disableNext: boolean }) {
    return <nav><ul className="pagination justify-content-center">
        <li className={`page-link ${props.currentPage && "disabled"}`} onClick={props.handlePrevious} >&lt;&lt; Previous</li>
        <li className={`page-link ${props.disableNext && "disabled"}`} onClick={props.handleNext} >Next &gt;&gt;</li>
    </ul></nav>;
}
export default class InvoiceDetail extends React.Component<InvoiceDetailProps, InvoiceDetailState> {
    invoiceService: IInvoiceService;
    constructor(props: InvoiceDetailProps) {
        super(props);
        this.state = {
            Filter: { Date: '' }, RequestInfo: { Status: CallStatus.EMPTY }, Page: 1
        };
        this.invoiceService = new InvoiceService();
    }
    handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { currentTarget: { name, value } } = e;
        this.setState(({ Filter }) => { return { Filter: { ...Filter, [name]: value } } });
    }
    handleSelection = (Id: number) => {
        if (Id !== this.state.ShopId)
            this.setState({ InvocieDetails: undefined });
        this.setState({ ShopId: Id == -1 ? undefined : Id });
    }
    handleSubmit = () => {
        this.setState({ Page: 1 });
        this.handlePagination(1);
    }
    handlePagination = (pos: number) => {
        const { ShopId, Filter, Page } = this.state;
        this.setState({ RequestInfo: { Status: CallStatus.LOADING } });
        this.invoiceService.GetInvoiceDetail(ShopId!, Page, Filter.Status, Filter.Date.length > 0 ? new Date(Filter.Date) : undefined)
            .then(res => this.setState({ InvocieDetails: res.data, Page: pos, RequestInfo: { Status: CallStatus.LOADED, Message: undefined } }))
            .catch(() => this.setState({ RequestInfo: { Status: CallStatus.ERROR, Message: undefined } }));
    }
    render() {
        const { ShopId, InvocieDetails } = this.state;
        return (<div className="">
            <Heading label="Get Invoice Details" />
            <div className="col-3 mt-2">
                <ShopSelector handleSelection={this.handleSelection} />
            </div>
            {ShopId && <Filter {...this.state.Filter} handleChange={this.handleChange} handleSubmit={this.handleSubmit} />}
            <Loader {...this.state.RequestInfo}>
                {InvocieDetails && <InvoiceDetailTable data={this.state.InvocieDetails!} page={this.state.Page} />}
            </Loader>
            {ShopId && InvocieDetails && <Pagination handleNext={() => this.handlePagination(this.state.Page + 1)}
                handlePrevious={() => this.handlePagination(-1)} currentPage={this.state.Page - 1} disableNext={this.state.InvocieDetails?.length == 0} />}
        </div>);
    }
}