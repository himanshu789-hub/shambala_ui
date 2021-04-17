import React from 'react';
import { SoldItem } from 'Types/DTO';
import MediatorSubject from 'Utilities/MediatorSubject';
import Observer from 'Utilities/Observer';
import TableRow from './Component/TableRow/TableRow';

type RowsWrapperProps = {
	subscriptionId: number;
	ProvideShopItemToHOC: (Invoices: SoldItem[]) => any;
	mediator: MediatorSubject;
	GetCaretSizeByProductId: (productId: number) => number;
};
type RowsWrapperState = {
	Members: Memeber[];
	SoldItems: SoldItem[];
};
type Memeber = {
	Observer: Observer;
	ComponentId: number;
};
export default class RowsWrapper extends React.Component<RowsWrapperProps, RowsWrapperState> {
	constructor(props: RowsWrapperProps) {
		super(props);
		this.state = {
			Members: [],
			SoldItems: [],
		};
	}
	AddARow = () => {
		const { mediator, subscriptionId } = this.props;
		const ComponentId = Math.random() * 10;
		const observer = mediator.GetAObserver(subscriptionId, ComponentId);
		const NewMember: Memeber = {
			ComponentId,
			Observer: observer,
		};
		const NewSoldItem: SoldItem = { CaretSize: 0, FlavouId: 0, Id: ComponentId, ProductId: 0, Quantity: 0 };

		this.setState(({ Members, SoldItems: SoldItem }) => {
			return { Members: [...Members, NewMember], SoldItems: [...SoldItem, NewSoldItem] };
		});
	};
	DeleteARow = (componentId: number) => {
		const {ProvideShopItemToHOC} = this.props;
 		this.setState(({ SoldItems }) => {
			return { SoldItems: SoldItems.filter(e => e.Id != componentId) };
		},()=>ProvideShopItemToHOC(this.state.SoldItems));
	};
	HandeChange = (ComponentId: number, name: string, Value: any) => {
		const { Members, SoldItems: SoldItem } = this.state;
		const { ProvideShopItemToHOC, GetCaretSizeByProductId } = this.props;
		const Member = Members.find(e => e.ComponentId === ComponentId);
		const soldItem = SoldItem.find(e => e.Id == ComponentId);
		let CaretMaxSize = soldItem?.CaretSize ?? 0;
		if (name == 'ProductId') CaretMaxSize = GetCaretSizeByProductId(Value);
		this.setState(({ SoldItems: SoldItem }) => {
			return {
				SoldItems: SoldItem.map(e => {
					if (e.Id === ComponentId) return { ...e, [name]: Value, CaretSize: CaretMaxSize };
					return e;
				}),
			};
		}, ProvideShopItemToHOC(this.state.SoldItems));
	};
	render() {
		const { SoldItems: SoldItem, Members } = this.state;
		return (
			<div >
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
								<TableRow
									key={e.Id}
									ComponentId={e.Id}
									Observer={observer}
									handleChange={this.HandeChange}
									CaretSize={e.CaretSize}
									HandleDelete={this.DeleteARow}
								/>
							);
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
