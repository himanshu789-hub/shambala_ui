import { useEffect } from "react";
import { useState } from "react";
import { OutgoingShipmentFlavourDetail, OutgoingShipmentPriceDetail, OutgoingShipmentProductDetail } from "Types/DTO";
import OutgoingService from 'Services/OutgoingShipmentService';

import './OutgoingDetail.css';
import { ApiStatusInfo, CallStatus } from "Components/Loader/Loader";

type OutgoingDetailProps = {
    Id?: string;
}
export default function OutgoingDetail(props: OutgoingDetailProps) {
    const [outgoingShipment, setOutgoingShipment] = useState<OutgoingShipmentPriceDetail | null>(null);
    const [callStatus, setCallStatus] = useState<ApiStatusInfo>({ Status: CallStatus.EMPTY })

    const { Id } = props;

    useEffect(() => {
        if (Id && Number.parseInt(Id)) {
            setCallStatus({ Status: CallStatus.LOADING });
            new OutgoingService()
                .GetOutgoingShipmentPriceDetailById(Number.parseInt(Id))
                .then(res => {
                    setOutgoingShipment(res.data);
                    setCallStatus({ Status: CallStatus.LOADED });
                })
                .catch(() => setCallStatus({ Status: CallStatus.ERROR, Message: undefined }));
        }
    }, []);

    if (!(Id && Number.parseInt(Id)))
        return <div className="alert alert-danger">Outgoing Shipment Id Not Valid</div>;

    return <div className="outgoing-detail">
        {outgoingShipment && <table className="table table-wrapper">
            <thead>
                <tr>
                    <th rowSpan={2}>S.No.</th>
                    <th rowSpan={2}>Product Name</th>
                    <th rowSpan={2}>Flavour Name</th>
                    <th colSpan={2}>Scheme</th>
                    <th colSpan={2}>Price</th>
                </tr>
                <tr>
                    <th>Quantity</th>
                    <th>Total Price</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                </tr>
            </thead>
            <tbody>

            </tbody>
        </table>}
    </div>;
}
function ProductDetails(props: { ProductDetail: OutgoingShipmentProductDetail }) {
    const { ProductDetail } = props;
    return <td></td>
}