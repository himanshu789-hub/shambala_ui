import { RouteComponentProps, useLocation, useParams } from "react-router";
import queryString from 'query-string';
import React from "react";
import './Credit.css';
import { OutgoingShipment, IShopDTO, InvoiceCreditInfoDTO, CreditDTO, CreditInfoDTO } from 'Types/DTO';
import Loader, { ApiStatusInfo, CallStatus } from "Components/Loader/Loader";
import ICreditService from "Contracts/services/ICreditService";
import CreditService from "Services/CreditService";
import { Invoice_QueryString_HOC,IInvoice_QueryString_Props } from "Components/Invoice/QueryStringWrapper/QueryStringWrapper";

export function Credit_Modal_Wrapper(props: { shopId: number, shipmentId: number, handleRemove(): void, show: boolean }) {
    const { handleRemove } = props;
    return <div className={`modal fade ${props.show?"show":''}`} id="exampleModalCenter" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLongTitle">Modal title</h5>
                    <button type="button" onClick={handleRemove} className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <Credit  ShopId={props.shopId} ShipmentId={props.shipmentId}/>
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
    PayingPrice: 0;
}
function InvoiceInfo(props: { Shop: IShopDTO; OutgoingShipment: OutgoingShipment; }) {
    return <div className="d-flex">
        <fieldset><legend>Shop</legend>
            <div className="d-inline-flex flex-column"><label>Name</label><input className="form-control" value={props.Shop.Title} /></div>
        </fieldset>
        <fieldset><legend>Shpment</legend>
            <div className="d-inline-flex flex-column"><label>Salesman Name</label><input className="form-control" value={props.OutgoingShipment.Salesman.FullName} /></div>
            <div className="d-inline-flex flex-column"><label>Date</label><input className="form-control" value={props.OutgoingShipment.DateCreated} /></div>
        </fieldset>
    </div>;
}
type CreditFormProps = {
    CreditLogs: CreditInfoDTO;
    PaidPrice: number;
    handle(e: React.ChangeEvent<HTMLInputElement>): void;
}
function NotPaidRow() {
    return <tr><td colSpan={3} className="text-center"><span className="fa-stack fa-2x">
        <i className="fa fa-ban fa-stack-2x"></i>
        <i className="fa fa-inr fa-stack-1x fa-inverse"></i>
    </span></td></tr>;
}
function CreditForm(props: CreditFormProps) {

    return (<div className="d-flex justify-content-around">
        <div className="border d-flex flex-column">
            <div className="group">
                <input className="control" value={props.PaidPrice} onChange={props.handle} />
                <button className="text text-white p-3"><i className="fa fa-plus"></i></button>
            </div>
            <div className="info">
                {!props.CreditLogs.IsComplted ?

                    (<div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">Due Price:&#8377;</span>
                        </div>
                        <input type="text" className="form-control" value={props.CreditLogs.DuePrice} aria-describedby="basic-addon1" />
                    </div>) :
                    <label className="text-success"><i className="fa fa-check"></i> Completed</label>
                }
            </div>
        </div>
        <div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Amount</th>
                        <th>Date Cleared</th>
                    </tr>
                </thead>
                <tbody>
                    {props.CreditLogs.Credits.length > 0 ? (props.CreditLogs.Credits.map(e => <tr><td>{e.Id}</td>
                        <td>{e.Amount}</td>
                        <td>{e.DateCreated}</td></tr>)) : (<NotPaidRow />)}
                </tbody>
            </table>
        </div>
    </div>);
}
class Credit extends React.Component<CreditProps, CreditState> {
    creditService: ICreditService;
    constructor(props: CreditProps) {
        super(props);
        this.creditService = new CreditService();
        this.state = {
            APIRequestInfo: { Status: CallStatus.EMPTY, Message: '' }, PayingPrice: 0
        }
    }
    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    }
    render() {
        const { InvoiceCreditInfo, APIRequestInfo, PayingPrice } = this.state;
        return (<div>
            <Loader {...APIRequestInfo}>
                {
                    this.state.InvoiceCreditInfo &&
                    <React.Fragment>
                        <InvoiceInfo OutgoingShipment={InvoiceCreditInfo!.OutgoingShipment} Shop={InvoiceCreditInfo!.Shop} />
                        <CreditForm CreditLogs={InvoiceCreditInfo!.CreditLogs} handle={this.handleChange} PaidPrice={PayingPrice} />
                    </React.Fragment>
                }
            </Loader>
        </div>)
    }
    componentDidMount() {
        const { ShopId, ShipmentId } = this.props;
        this.setState({ APIRequestInfo: { Status: CallStatus.LOADING, Message: 'Gathering Credit Info' } });
        this.creditService.GetCreditInfo(ShipmentId, ShopId)
            .then(res => this.setState({ APIRequestInfo: { Status: CallStatus.LOADED, Message: undefined }, InvoiceCreditInfo: res.data }))
            .catch(() => this.setState({ APIRequestInfo: { Status: CallStatus.ERROR, Message: undefined } }));
    }
}

export const CreditQueryWrapper = Invoice_QueryString_HOC({Component:Credit});
