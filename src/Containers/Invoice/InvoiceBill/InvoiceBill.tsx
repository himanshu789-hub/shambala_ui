import Loader, { ApiStatusInfo, CallStatus } from "Components/Loader/Loader";
import { useEffect, useState } from "react";
import InvoiceService from "Services/InvoiceService";
import { InvoiceBillingDTO } from "Types/DTO";
import { IInvoice_QueryString_Props, Invoice_QueryString_HOC } from "Components/Invoice/QueryStringWrapper/QueryStringWrapper";
import { getSchemeText, getQuantityInText } from "Utilities/Utilities";
import { EmptyTableBody } from "Components/Miscellaneous/Miscellaneous";
import { Credit_Modal_Wrapper } from "Containers/Credit/Credit";

type DisplayInvoiceBillProps = {
    InvoiceBillDetail: InvoiceBillingDTO;
    ToggleModal(): void;
    ShowModal: boolean;
}
function DisplayInvoiceBill(props: DisplayInvoiceBillProps) {
    const { Shop, OutgoingShipment, Scheme, BillingInfo } = props.InvoiceBillDetail;
    return (<div className="bill-info">
        <fieldset disabled>
            <div className="row">
                <div className="col form-group">
                    <label>Shop Name</label>
                    <input type="text" value={Shop.Title} className="form-control" />
                </div>
            </div>
            <div className="row">
                <div className="col form-group">
                    <label>Address</label>
                    <input type="text" value={Shop.Address} className="form-control" />
                </div>
            </div>
            <div className="row">
                <div className="col form-group">
                    <label>Date Created : </label>
                    <input type="text" value={new Date(props.InvoiceBillDetail.DateCreated).toDateString()} className="form-control" />
                </div>
                <div className="col form-group">
                    <label>Scheme : </label>
                    <input type="text" value={getSchemeText(Scheme)} className="form-control" />
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
                            <td className="text-align-right" colSpan={4}>Total</td>
                            <td className="fa fa-inr"><input value={props.InvoiceBillDetail.TotalSellingPrice} /></td>
                        </tr>
                        <tr>
                            <td className="text-align-right" colSpan={4}>Due Left</td>
                            <td className="d-inline-flex flex-column">
                                <input value={props.InvoiceBillDetail.TotalDuePrice} />
                                <label onClick={props.ToggleModal}>View Log</label>
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
    useEffect(() => {
        (new InvoiceService()).GetInvoiceBill(props.ShopId, props.ShipmentId)
            .then(res => { setRequestInfo({ Status: CallStatus.LOADED, Message: undefined }); setInvoiceBill(res.data); })
            .catch(() => setRequestInfo({ Status: CallStatus.ERROR, Message: undefined }));
    }, [])
    const toogleModal = () => {
        setShowModal(!showModal);
    }
    return (<Loader {...requestInfo}>
        {bill && <DisplayInvoiceBill InvoiceBillDetail={bill!} ToggleModal={toogleModal} ShowModal={showModal} />}
    </Loader>);
}

const InvoiceBillWrapper = Invoice_QueryString_HOC({ Component: InvoiceBill });

export default InvoiceBillWrapper;