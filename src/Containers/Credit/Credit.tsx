import { RouteComponentProps, useLocation, useParams } from "react-router";
import queryString from 'query-string';
import React from "react";
import './Credit.css';
import { OutgoingShipment, IShopDTO, InvoiceCreditInfoDTO, CreditDTO } from 'Types/DTO';
import Loader, { ApiStatusInfo, CallStatus } from "Components/Loader/Loader";
import ICreditService from "Contracts/services/ICreditService";
import CreditService from "Services/CreditService";
import { Invoice_QueryString_HOC, IInvoice_QueryString_Props } from "Components/Invoice/QueryStringWrapper/QueryStringWrapper";
import IInvoiceService from "Contracts/services/IInvoiceService";
import InvoiceService from "Services/InvoiceService";
import { provideValidFloat, provideValidInteger, tocurrencyText } from "Utilities/Utilities";
import Alert from "Components/Alert/Alert";
import { addDanger } from "Utilities/AlertUtility";

export function Credit_Modal_Wrapper(props: { shopId: number, shipmentId: number, handleRemove(): void, show: boolean }) {
    const { handleRemove } = props;
    return <div className={`modal fade ${props.show ? "show d-block transparent-bg" : ''}`} id="exampleModalCenter" tabIndex={-1}
        role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog-centered" role="document">
            <div className="modal-content">
                <div className="modal-header bg-app text-white">
                    <h5 className="modal-title" id="exampleModalLongTitle">Credit Log</h5>
                    <button type="button" onClick={handleRemove} className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <Credit ShopId={props.shopId} ShipmentId={props.shipmentId} />
                </div>
            </div>
        </div>
    </div>;
}
interface CreditProps extends IInvoice_QueryString_Props {
}
type CreditState = {
    InvoiceCreditInfo?: InvoiceCreditInfoDTO;
    APIRequestInfo: ApiStatusInfo;
    PayingPrice: string;
}
function InvoiceInfo(props: { Shop: IShopDTO; OutgoingShipment: OutgoingShipment; }) {
    return <div className="d-flex invoice-info">
        <div className="d-inline-flex flex-column col">
            <label>Name</label><input className="form-control" readOnly value={props.Shop.Title} />
        </div>
        <div className="d-inline-flex flex-column col"><label>Salesman Name</label><input className="form-control" readOnly value={props.OutgoingShipment.Salesman.FullName} /></div>
        <div className="d-inline-flex flex-column ml-3 col"><label>Date</label><input className="form-control" readOnly value={new Date(props.OutgoingShipment.DateCreated).toDateString()} /></div>
    </div>;
}
type CreditFormProps = {
    InvoiceCredit: InvoiceCreditInfoDTO;
    PaidPrice: string;
    handle(e: React.ChangeEvent<HTMLInputElement>): void;
    handleSubmit(): void;
    handleBlur(): void;
}
function NotPaidRow() {
    return <tr className="row"><td colSpan={3} className="col text-center">
        <span className="fa-stack fa-2x">
            <i className="fa fa-ban fa-stack-2x text-danger"></i>
            <i className="fa fa-inr fa-stack-1x fa-inverse text-dark"></i>
        </span>
    </td></tr>;
}
function CreditLogTable(props: { Credits: CreditDTO[] }) {
    const { Credits } = props;
    return <table className="table table-hover credit-log-table">
        <thead>
            <tr className="row">
                <th className="col">S.No</th>
                <th className="col">Amount</th>
                <th className="col">Date Cleared</th>
            </tr>
        </thead>
        <tbody>
            {Credits.length > 0 ? (Credits.map((e, index) => <tr className="row" key={e.Id}>
                <td className="col">{index + 1}</td>
                <td className="col">{tocurrencyText(e.Amount)}</td>
                <td className="col">{new Date(e.DateRecieved).toDateString()}</td></tr>)) : (<NotPaidRow />)}
        </tbody>
    </table>;
}
function CreditForm(props: CreditFormProps) {
    return (<div className="d-flex flex-column">
        {!props.InvoiceCredit.IsCompleted ? (<React.Fragment>
            <div className="bg-pay form-group p-1">
                <label className="font-weight-bold text-dark">Payment Recieved : </label>
                <div className="group">
                    <input type="text" onBlur={props.handleBlur} className="form-control due-control" value={props.PaidPrice} name="PaidPrice" onChange={props.handle} />
                    <button className="bg-success text-white p-3 btn border-0 rounded-0" onClick={props.handleSubmit} ><i className="fa fa-plus"></i></button>
                </div>
            </div>

            <div className="info">
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text bg-warning text-white font-weight-bold" id="basic-addon1">Due Price:</span>
                    </div>
                    <input type="text" className="form-control" value={tocurrencyText(props.InvoiceCredit.TotalDuePrice)} aria-describedby="basic-addon1" />
                </div>
            </div></React.Fragment>) :
            <label className="text-success"><i className="fa fa-check"></i> Completed</label>
        }
    </div>
    );
}

class Credit extends React.Component<CreditProps, CreditState> {
    creditService: ICreditService;
    invoiceService: IInvoiceService;
    constructor(props: CreditProps) {
        super(props);
        this.creditService = new CreditService();
        this.state = {
            APIRequestInfo: { Status: CallStatus.EMPTY, Message: '' }, PayingPrice: ''
        }
        this.invoiceService = new InvoiceService();
    }
    IsPriceValueValid(value: string) {
        let IsValueValid = true;
        if (!new RegExp(/^\d{0,5}((\.?)\d{0,2})$/).test(value))
            IsValueValid = false;
        return IsValueValid;
    }
    handleSubmit = () => {
        if (Number.isFinite(Number.parseFloat(this.state.PayingPrice)) && Number.parseFloat(this.state.PayingPrice) != 0) {
            this.creditService
                .Add({ Amount: Number.parseFloat(this.state.PayingPrice), DateRecieved: new Date().toISOString(), Id: 1, OutgoingShipmentId: this.props.ShipmentId, ShopId: this.props.ShopId })
                .then(() => {
                    this.setState({ PayingPrice: '0.00' });
                    return this.invoiceService.GetInvoiceDetailWithCreditLog(this.props.ShopId, this.props.ShipmentId);
                })
                .then(res => this.setState({ InvoiceCreditInfo: res.data }))
                
        }
        else
            addDanger("Price Cannot Be Zero");
    }
    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { currentTarget: { name, value } } = e;
        if (name == "PaidPrice" && this.IsPriceValueValid(value)) {
            this.setState({ PayingPrice: value });
        }
    }
    OnBlur = () => {
        const { PayingPrice } = this.state;
        if (PayingPrice.endsWith('.'))
            this.setState({ PayingPrice: PayingPrice + '00' });
    }
    render() {
        const { InvoiceCreditInfo, APIRequestInfo, PayingPrice } = this.state;
        return (<div>
            <Loader {...APIRequestInfo}>
                {
                    this.state.InvoiceCreditInfo &&
                    <React.Fragment>
                        <InvoiceInfo OutgoingShipment={InvoiceCreditInfo!.OutgoingShipment} Shop={InvoiceCreditInfo!.Shop} />
                        <div className="row mt-3">
                            <div className="col">
                                <CreditForm InvoiceCredit={InvoiceCreditInfo!} handle={this.handleChange} PaidPrice={PayingPrice}
                                    handleSubmit={this.handleSubmit} handleBlur={this.OnBlur} />
                            </div>
                            <div className="col">
                                <CreditLogTable Credits={InvoiceCreditInfo?.Credits ?? []} />
                            </div>
                        </div>
                    </React.Fragment>
                }
            </Loader>

        </div>)
    }
    componentDidMount() {
        const { ShopId, ShipmentId } = this.props;
        this.setState({ APIRequestInfo: { Status: CallStatus.LOADING, Message: 'Gathering Credit Info' } });
        this.invoiceService.GetInvoiceDetailWithCreditLog(ShopId, ShipmentId)
            .then(res => this.setState({ APIRequestInfo: { Status: CallStatus.LOADED, Message: undefined }, InvoiceCreditInfo: res.data }))
            .catch(() => this.setState({ APIRequestInfo: { Status: CallStatus.ERROR, Message: undefined } }));
    }
}

export const CreditQueryWrapper = Invoice_QueryString_HOC({ Component: Credit });
