import React from 'react';
import { SoldItem } from 'Types/DTO';
import MediatorSubject from 'Utilities/MediatorSubject';
import Observer from 'Utilities/Observer';
import ItemsHolder from './Component/TableRow/ItemHolder';
import TableRow from './Component/TableRow/ItemHolder';
type RowsWrapperProps = {
	subscriptionId: number;
	mediator: MediatorSubject;
};
type RowsWrapperState = {
	Members: Memeber[];
	SoldItem: SoldItem[];
};
type Memeber = {
	Observer: Observer;
	ComponentId: number;
};
export default class RowsWrapper extends React.Component<RowsWrapperProps, RowsWrapperState> {
	constructor(props: RowsWrapperProps) {
		super(props);
	}
	AddARow = () => {
		const { mediator, subscriptionId } = this.props;
		const ComponentId = Math.random()*10;
		const observer = mediator.GetAObserver(subscriptionId, ComponentId);
		const NewMember: Memeber = {
			ComponentId,
			Observer: observer,
		};
		const NewSoldItem: SoldItem = { CaretSize: 0, FlavouId: 0, Id: ComponentId, ProductId: 0, Quantity: 0 };
		this.setState(({ Members, SoldItem }) => {
			return { Members: [...Members, NewMember], SoldItem: [...SoldItem, NewSoldItem] };
		});
	};
	HandeChange = (ComponentId: number, name: string, Value: any) => {
		const { Members, SoldItem } = this.state;
		const Member = Members.find(e => e.ComponentId === ComponentId);
		const soldItem = SoldItem.find(e => e.Id == ComponentId);
		this.setState(({ SoldItem }) => {
			return {
				SoldItem: SoldItem.map(e => {
					if (e.Id === ComponentId) return { ...e, [name]: Value };
					return e;
				}),
			};
		});
	};
	render() {
		const { SoldItem, Members } = this.state;
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
						{SoldItem.map((e, index) => {
							const observer = Members.find(f => f.ComponentId == e.Id)?.Observer as Observer;
							return (
								<ItemsHolder
									key={e.Id}
									ComponentId={e.Id}
									Observer={observer}
									handleChange={this.HandeChange}
									CaretSize={e.CaretSize}
								/>
							);
						})}
					</tbody>
				</table>
				<button onClick={this.AddARow}>
					<i className='fa fa-plus'></i> Add More Item
				</button>
			</div>
		);
	}
}
