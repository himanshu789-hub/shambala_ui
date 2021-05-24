import { Redirect, RouteComponentProps, useLocation, useParams } from "react-router";
import queryString from 'query-string';
import React from "react";

interface ICreditWrapperProps extends RouteComponentProps {

}
export default function Credit_Wrapper(props: ICreditWrapperProps) {
    const parse = queryString.parse(props.location.search);
    const shopId = parse.shopId + '';
    const shipmentId = parse.shipmentId + '';
    if (shipmentId && Number.parseInt(parse.shipmentId + '') && shopId && Number.parseInt(parse.ShopId + ''))
        return <Credit ShopId={Number.parseInt(shopId)} OutgoingShipmentId={Number.parseInt(shipmentId)} />
    return <label>Not Proper Query String</label>;
}
type CreditProps = {
    ShopId: number;
    OutgoingShipmentId: number;
}
type CreditState = {

}
class Credit extends React.Component<CreditProps, CreditState> {
    constructor(props: CreditProps) {
        super(props);
    }
    render() {
        return (<div></div>)
    }
    componentDidMount() {
      
    }
}