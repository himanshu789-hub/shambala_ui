import Loader, { ApiStatusInfo, CallStatus } from "Components/Loader/Loader";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import InvoiceService from "Services/InvoiceService";
import { InvoiceBillingDTO } from "Types/DTO";
import queryString from 'querystring';
import { IInvoice_QueryString_Props, Invoice_QueryString_HOC } from "Components/Invoice/QueryStringWrapper/QueryStringWrapper";


function DisplayInvoiceBill(bill: InvoiceBillingDTO) {
    return (<div></div>);
}
interface IInvoiceBillProps extends IInvoice_QueryString_Props {

}
function InvoiceBill(props: IInvoiceBillProps) {
    const [bill, setInvoiceBill] = useState<InvoiceBillingDTO>();
    const [requestInfo, setRequestInfo] = useState<ApiStatusInfo>({ Status: CallStatus.EMPTY });
    useEffect(() => {
        (new InvoiceService()).GetInvoices(props.ShopId, props.ShipmentId)
            .then(res => { setRequestInfo({ Status: CallStatus.LOADED, Message: undefined }); setInvoiceBill(res.data); })
            .catch(() => setRequestInfo({ Status: CallStatus.ERROR, Message: undefined }));
    }, [])

    return (<Loader {...requestInfo}>
        <DisplayInvoiceBill {...bill!} />
    </Loader>);
}

const InvoiceBillWrapper = Invoice_QueryString_HOC({ Component: InvoiceBill });

export default InvoiceBillWrapper;