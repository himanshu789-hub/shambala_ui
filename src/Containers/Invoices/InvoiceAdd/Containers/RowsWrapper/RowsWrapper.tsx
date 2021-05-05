import { InvoiceContext } from 'Containers/Invoices/InvoiceWrapper/Context';
import React from 'react';
import { SoldItem } from 'Types/DTO';
import Observer from 'Utilities/Observer';
import TableRow from './Component/TableRow/TableRow';

type RowsWrapperProps = {
	subscriptionId: number;
	AddASubscriptionComponent(subscription: number): void;
	HandleComponentDelete(subscriptionId: number, componentId: number): void;
	HandleChange(subscriptionId: number, componentId: number, name: string, value: string): void;
	GetObserverBySubscriberAndComponentId(subscriptionId: number, componentId: number): Observer;
	SoldItems: SoldItem[];
};
type RowsWrapperState = {
};
export default class RowsWrapper extends React.Component<RowsWrapperProps, RowsWrapperState> {
	constructor(props: RowsWrapperProps) {
		super(props);
	}
	AddARow = () => {
		const { subscriptionId } = this.props;
		const { AddASubscriptionComponent } = this.props;
		AddASubscriptionComponent(subscriptionId);
	};
	DeleteARow = (componentId: number) => {
		const { subscriptionId, HandleComponentDelete } = this.props;
		HandleComponentDelete(subscriptionId, componentId);
	};
	HandeChange = (ComponentId: number, name: string, Value: any) => {
		const {  HandleChange, subscriptionId } = this.props;
		HandleChange(subscriptionId, ComponentId, name, Value);
	};
	GetObserverByComonentId = (componentId: number): Observer => {
		const { subscriptionId, GetObserverBySubscriberAndComponentId } = this.props;
		return GetObserverBySubscriberAndComponentId(subscriptionId, componentId);
	}
	render() {
		const { SoldItems } = this.props;
		return (
			<div>
				<table className='table'>
					<thead className='bg-light'>
						<tr>
							<th>Product Name</th>
							<th>Flavour Name</th>
							<th>Caret Size</th>
							<th>Quantity</th>
							<th className='text-white'>aa</th>
						</tr>
					</thead>
					<tbody>
						{SoldItems.map((e, index) => {
							return (
								<TableRow
									key={e.Id}
									ComponentId={e.Id}
									Item={e}
									GetObserver={this.GetObserverByComonentId}
									handleChange={this.HandeChange}
									HandleDelete={this.DeleteARow}
								/>
							)
						})}
					</tbody>
				</table>
				<button onClick={this.AddARow} className="btn btn-primary btn-sm">
					<i className='fa fa-plus'></i> Add More Item
				</button>
			</div>
		);
	}
}
