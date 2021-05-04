import CaretSize from 'Components/CaretSize/CaretSize';
import React, { ChangeEvent } from 'react';
import { ProductInfo } from 'Types/Mediator';
import { Flavour, SoldItem } from 'Types/DTO';
import Observer from 'Utilities/Observer';
import './TableRow.css';

type ItemsHolderProps = {
	handleChange: (componentId: number, name: string, value: any) => void;
	CaretSize?: number;
	ComponentId: number;
	GetObserver(componentId: number): Observer;
	HandleDelete: (componentId: number) => void;
	Item: SoldItem;
};
type ItemHolderState = {
	ProductInfo: ProductInfo[];
	QuantityLimit: number;
	Flavours: Flavour[];
};
export default class TableRow extends React.Component<ItemsHolderProps, ItemHolderState> {
	constructor(props: ItemsHolderProps) {
		super(props);
		const { GetObserver, ComponentId } = this.props;
		const Observer = GetObserver(ComponentId);
		this.state = {
			Flavours: [],
			QuantityLimit: -1,
			ProductInfo: Observer.GetProduct(),
		};
	}
	Delete = () => {
		const { GetObserver, ComponentId, HandleDelete } = this.props;
		const Observer = GetObserver(ComponentId);
		Observer.Unubscribe();
		HandleDelete(ComponentId);
	}
	HandleFocus = () => {
		const { GetObserver, ComponentId } = this.props;
		const Observer = GetObserver(ComponentId);
		Observer.UnsubscribeToQuantity();
		this.setState({ QuantityLimit: Observer.GetQuantityLimit() })
	}
	HandleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const {
			currentTarget: { name, value },
		} = e;
		const { handleChange, ComponentId } = this.props;
		if (name == 'ProductId' || name == 'FlavourId') {
			const val = Number.parseInt(value);

			const { GetObserver, ComponentId } = this.props;
			const Observer = GetObserver(ComponentId);
			switch (name) {
				case 'ProductId':
					Observer.SetProduct(val);

					this.setState({ Flavours: Observer.GetFlavours() });
					break;
				case 'FlavourId':
					Observer.SetFlavour(val);
					const QuantityLimit = Observer.GetQuantityLimit() as number;
					this.setState({ QuantityLimit: QuantityLimit });
					break;
				default:
					break;
			}
			handleChange(ComponentId, name, val);
		}
	};
	HandleInput = (num: number) => {
		const { handleChange, ComponentId, GetObserver } = this.props;
		const Observer = GetObserver(ComponentId);
		Observer.UnsubscribeToQuantity();
		handleChange(ComponentId, 'Quantity', num);
		Observer.SetQuantity(num);

	};
	HandleClick = (e: React.FocusEvent<HTMLSelectElement>) => {
		const { GetObserver, ComponentId } = this.props;
		const Observer = GetObserver(ComponentId);
		const { currentTarget: { name } } = e;
		console.log(name + ' Click Event Triggers');
		switch (name) {
			case 'FlavourId':
				this.setState({ Flavours: Observer.GetFlavours() });
				break;
			case 'ProductId':
				this.setState({ ProductInfo: Observer.GetProduct() });
				break;
			default: break;
		}
	}

	render() {
		const { ProductInfo, QuantityLimit, Flavours: Flavours } = this.state;
		const { CaretSize: MaxSize, Item: { ProductId, FlavourId } } = this.props;

		return (
			<tr>
				<td>
					<select
						className={`form-control ${ProductId == -1 ? 'is-invalid' : ''}`}
						name='ProductId'
						value={ProductId}
						defaultValue={'-1'}
						onChange={this.HandleChange}
						onFocus={this.HandleClick}>

						<option disabled  value='-1'>
							-- Select A Product --
						</option>
						{ProductInfo.map(e => (
							<option key={e.Id} value={e.Id}>
								{e.Title}
							</option>
						))}
					</select>
				</td>
				<td>
					<select
						className={`form-control ${FlavourId == -1 ? 'is-invalid' : ''}`}
						name='FlavourId'
						value={FlavourId}
						defaultValue={'-1'}
						onChange={this.HandleChange} onFocus={this.HandleClick}>
						<option disabled  value='-1'>-- Select A Flavour -- </option>
						{Flavours.map(e => (
							<option key={e.Id} value={e.Id}>
								{e.Title}
							</option>
						))}
					</select>
				</td>
				<td>
					<input className={`form-control ${MaxSize == 0 ? 'is-invalid' : ''}`} value={MaxSize} readOnly/>
				</td>
				<td className="caret">
					<CaretSize Size={MaxSize ?? 0} handleInput={this.HandleInput} Limit={QuantityLimit} OnFocusIn={this.HandleFocus} />
				</td>
				<td>
					<button onClick={this.Delete} className="btn btn-light w-100"><i className="fa fa-trash"></i></button>
				</td>
			</tr>
		);
	}

	componentDidMount() {
		const { GetObserver, ComponentId } = this.props;
		const Observer = GetObserver(ComponentId);
		Observer.SetComponent(this);
	}
}
