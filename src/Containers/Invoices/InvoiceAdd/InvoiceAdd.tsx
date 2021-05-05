import React, { CSSProperties } from 'react';
import { CallStatus } from 'Components/Loader/Loader';
import ShopSelector from './Containers/ShopSelector/ShopSelector';
import InvoiceScheme from './Containers/InvoiceScheme/InvoiceScheme';
import RowsWrapper from './Containers/RowsWrapper/RowsWrapper';
import { ShopInvoice, SoldItem } from '../../../Types/DTO';
import './InvoiceAdd.css';
import { InvoiceContext } from '../InvoiceWrapper/Context';

interface IInvoiceProps {
	SubscriptionId: number;
	ShopInvoice: ShopInvoice;
	HandleDelete: (SubscriptionId: number) => void;
	GetCaretSizeByProductId: (productId: number) => number;
	AddASubscriberComponent(subscriptionId: number): void;
	HandleComponentDelete(subscriptionId: number, componentId: number): void;
	HandleShopOrSchemeChange(subscriptionId: number, name: string, value: any): void;
	IsShopAlreadySelected?: boolean;
}
type InvoicesState = {
	APIStatus: number;
};

type AlertMessageProps = {
	children: JSX.Element;
	mesage: string;
	show: boolean;
}
interface IAlertMessageProperty extends CSSProperties {
	'--msg': string;
}
function AlertMessage(props: AlertMessageProps) {
	const { show } = props;
	const Property: IAlertMessageProperty = { "--msg": props.mesage };
		return <div className="d-flex"><div className="error">{props.children}</div><span className={`tool-tip ${show?"show":""}`}><i className="fa fa-exclamation-triangle p-1" aria-hidden="true"></i> {props.mesage}</span></div>;
}
export default class InvoiceAdd extends React.Component<IInvoiceProps, InvoicesState> {
	constructor(props: IInvoiceProps) {
		super(props);
		this.state = {
			APIStatus: CallStatus.EMPTY,
		};
	}
	HandleSelection = (name: string, value: any) => {
		const { HandleShopOrSchemeChange, SubscriptionId } = this.props;
		HandleShopOrSchemeChange(SubscriptionId, name, value);
	}
	HandleDelete = () => {
		const { SubscriptionId, HandleDelete } = this.props;
		HandleDelete(SubscriptionId);
	}
	render() {

		const { ShopInvoice: { SchemeId, ShopId, Invoices: SoldItems }, IsShopAlreadySelected } = this.props;

		const { SubscriptionId, GetCaretSizeByProductId, AddASubscriberComponent, HandleComponentDelete } = this.props;
		return (
			<div className='card'>
				<div className='card-head d-flex justify-content-between'>
					<AlertMessage mesage={"Shop Already Selected"} show={IsShopAlreadySelected==undefined ? false : IsShopAlreadySelected}>
						<ShopSelector handleSelection={this.HandleSelection} />
					</AlertMessage>
					<button className='btn btn-danger' onClick={this.HandleDelete}>
						<i className='fa fa-times'></i>
					</button>
				</div>
				<div className='card-body'>
					{ShopId && <InvoiceScheme handleSchemeSelection={this.HandleSelection} ShopId={ShopId} />}
					{ShopId && SchemeId && (
						<InvoiceContext.Consumer>
							{
								({ GetObserverBySubscriberAndComponentId, HandleChange }) =>
									<RowsWrapper
										GetObserverBySubscriberAndComponentId={GetObserverBySubscriberAndComponentId}
										HandleChange={HandleChange}
										subscriptionId={SubscriptionId} GetCaretSizeByProductId={GetCaretSizeByProductId} HandleComponentDelete={HandleComponentDelete} AddASubscriptionComponent={AddASubscriberComponent} SoldItems={SoldItems} />
							}
						</InvoiceContext.Consumer>
					)}
				</div>
			</div>
		);
	}
	componentDidMount() { }
}
