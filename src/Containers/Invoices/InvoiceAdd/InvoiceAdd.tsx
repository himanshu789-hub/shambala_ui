import React from 'react';
import { CallStatus } from 'Components/Loader/Loader';
import ShopSelector from './Containers/ShopSelector/ShopSelector';
import InvoiceScheme from './Containers/InvoiceScheme/InvoiceScheme';
import RowsWrapper from './Containers/RowsWrapper/RowsWrapper';
import { ShopInvoice, SoldItem } from '../../../Types/DTO';
import './InvoiceAdd.css';
import { InvoiceContext } from '../InvoiceWrapper/Context';

interface IInvoiceProps {
	SubscriptionId: number;
	HandleDelete: (SubscriptionId: number) => void;
	GetCaretSizeByProductId: (productId: number) => number;
	ShopInvoice: ShopInvoice;
	AddASubscriberComponent(subscriptionId: number): void;
	HandleComponentDelete(subscriptionId: number, componentId: number): void;
	HandleShopOrSchemeChange(subscriptionId: number, name: string, value: any): void;
}
type InvoicesState = {
	APIStatus: number;
};
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
	render() {

		const { ShopInvoice: { SchemeId, ShopId, Invoices: SoldItems } } = this.props;

		const { SubscriptionId, HandleDelete, GetCaretSizeByProductId, AddASubscriberComponent, HandleComponentDelete } = this.props;
		return (
			<div className='card'>
				<div className='card-head d-flex justify-content-between'>
					<ShopSelector handleSelection={this.HandleSelection} />
					<button className='btn btn-danger'>
						<i className='fa fa-times' onClick={() => HandleDelete(SubscriptionId)}></i>
					</button>
				</div>
				<div className='card-body'>
					{ShopId && <InvoiceScheme handleSchemeSelection={this.HandleSelection} ShopId={ShopId} />}
					{ShopId && SchemeId && (
						<InvoiceContext.Consumer>
							{
								({GetObserverBySubscriberAndComponentId,HandleChange}) =>
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
