import Loader, { ApiStatusInfo, CallStatus } from "Components/Loader/Loader";
import { useEffect, useState } from "react";
import InvoiceService from "Services/InvoiceService";
import { InvoiceBillingDTO } from "Types/DTO";
import { IInvoice_QueryString_Props, Invoice_QueryString_HOC } from "Components/Invoice/QueryStringWrapper/QueryStringWrapper";
import { getSchemeText, getQuantityInText, tocurrencyText } from "Utilities/Utilities";
import { EmptyTableBody } from "Components/Miscellaneous/Miscellaneous";
import { Credit_Modal_Wrapper } from "Containers/Credit/Credit";

import './InvoiceBill.css';

type DisplayInvoiceBillProps = {
    InvoiceBillDetail: InvoiceBillingDTO;
    ToggleModal(): void;
    ShowModal: boolean;
}
function DisplayInvoiceBill(props: DisplayInvoiceBillProps) {
    const { Shop, OutgoingShipment, Scheme, BillingInfo } = props.InvoiceBillDetail;
    return (<div className="p-2 bill-info">
        <fieldset disabled>
            <div className="row">
                <div className="col-3 form-group">
                    <label>Shop Name</label>
                    <input type="text" value={Shop.Title} readOnly={true} className="form-control" />
                </div>
                <div className="col-3 form-group">
                    <label>Address</label>
                    <input type="text" value={Shop.Address} readOnly={true} className="form-control text-truncate"
                        data-toggle="tooltip" data-placement="bottom" title={Shop.Address} />
                </div>

                <div className="col-2 form-group">
                    <label>Date Created : </label>
                    <input type="text" readOnly={true} value={new Date(props.InvoiceBillDetail.DateCreated).toDateString()} className="form-control" />
                </div>
                <div className="col-2 form-group">
                    <label>Scheme : </label>
                    <input type="text" readOnly={true} value={getSchemeText(Scheme)} className="form-control" />
                </div>
            </div>
        </fieldset>
        <div className="mt-2">
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>S.No.</th>
                            <th>Product</th>
                            <th>Flavour</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {BillingInfo.length > 0 ?
                            BillingInfo.map((e, index) => <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{e.ProductName}</td>
                                <td>{e.FlavourName}</td>
                                <td>{getQuantityInText(e.QuantityPurchase, e.CaretSize)}</td>
                                <td>{e.SellingPrice}</td>
                            </tr>) :
                            <EmptyTableBody numberOfColumns={5} />}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="text-right text-info font-weight-bold text-underline pr-1" colSpan={4}>Total</td>
                            <td><input className="form-control text-price" value={tocurrencyText(props.InvoiceBillDetail.TotalSellingPrice)} readOnly={true} /></td>
                        </tr>
                        <tr>
                            <td className="text-right text-warning font-weight-bold text-underline align-top pr-1" colSpan={4}>Due Left</td>
                            <td className="">
                                {props.InvoiceBillDetail.IsCompleted ?
                                    <label className="text-success"><i className="fa fa-check"></i>Completed</label> :
                                    <input className="form-control" value={tocurrencyText(props.InvoiceBillDetail.TotalDuePrice)} readOnly={true} />
                                } <button className="badge badge-primary" onClick={props.ToggleModal} data-toggle="modal" data-target="#exampleModalCenter"> View Log</button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

        </div>

        <Credit_Modal_Wrapper shipmentId={OutgoingShipment.Id} shopId={Shop.Id} show={props.ShowModal}
            handleRemove={props.ToggleModal} />
    </div>);
}
interface IInvoiceBillProps extends IInvoice_QueryString_Props {

}
function InvoiceBill(props: IInvoiceBillProps) {
    const [bill, setInvoiceBill] = useState<InvoiceBillingDTO>();
    const [requestInfo, setRequestInfo] = useState<ApiStatusInfo>({ Status: CallStatus.EMPTY });
    const [showModal, setShowModal] = useState<boolean>(false);
    const FetchDetails = function () {
        setRequestInfo({ Status: CallStatus.LOADING, Message: 'Fetching Invoice Details' });
        (new InvoiceService()).GetInvoiceBill(props.ShopId, props.ShipmentId)
            .then(res => { setRequestInfo({ Status: CallStatus.LOADED, Message: undefined }); setInvoiceBill(res.data); })
            .catch(() => setRequestInfo({ Status: CallStatus.ERROR, Message: undefined }));
    }
    useEffect(() => {
        FetchDetails();
    }, [])
    const toogleModal = () => {
        setShowModal(!showModal);
        if (showModal) {
            FetchDetails();
        }
    }
    return (<Loader {...requestInfo}>
        {bill && <DisplayInvoiceBill InvoiceBillDetail={bill!} ToggleModal={toogleModal} ShowModal={showModal} />}
    </Loader>);
}

const InvoiceBillWrapper = Invoice_QueryString_HOC({ Component: InvoiceBill });

export default InvoiceBillWrapper;