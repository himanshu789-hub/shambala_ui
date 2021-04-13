import CaretSize from 'Components/CaretSize/CaretSize';
import React, { ChangeEvent, ChangeEventHandler } from 'react';
import { ProductInfo } from 'Types/Mediator';
import { Flavour } from 'Types/Types';
import Observer from 'Utilities/Observer';
import './ItemHolder.css';

type ItemsHolderProps = {
	handleChange: (componentId: number, name: string, value: any) => void;
	CaretSize?: number;
	ComponentId: number;
	Observer: Observer;
};
type ItemHolderState = {
	ProductInfo: ProductInfo[];
	ProductId: number;
	QuantityLimit: number;
	SelectedFlavour: number;
	FlavourId: Flavour[];
};
export default class ItemsHolder extends React.Component<ItemsHolderProps, ItemHolderState> {
	constructor(props: ItemsHolderProps) {
		super(props);
	}
	HandleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const {
			currentTarget: { name, value },
		} = e;
		const { handleChange, ComponentId } = this.props;
		if (name == 'ProductId' || name == 'FlavourId') {
			const val = Number.parseInt(value);
			this.setState(prevState => {
				return { ...prevState, [name]: val };
			});

			const { Observer } = this.props;
			switch (name) {
				case 'ProductId':
					Observer.SetProduct(val);
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
	HandleInput = (e: number) => {
		const { handleChange, ComponentId, Observer } = this.props;
		handleChange(ComponentId, 'Quantity', e);
		Observer.SetQuantity(e);
	};
	render() {
		const { ProductInfo, FlavourId: Flavours, SelectedFlavour, ProductId: SelectedProduct } = this.state;
		const { CaretSize: MaxSize } = this.props;

		return (
			<tr>
				<td>
					<select className='form-control' name='ProductId' value={SelectedProduct} onChange={this.HandleChange}>
						<option disabled selected value='-1'>
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
					<select className='form-control' name='FlavourId' value={SelectedFlavour} onChange={this.HandleChange}>
						<option disabled selected value='-1'>
							-- Select A Flavour --
						</option>
						{Flavours.map(e => (
							<option key={e.Id} value={e.Id}>
								{e.Title}
							</option>
						))}
					</select>
				</td>
				<td>
					<input className='form-control' value={MaxSize} />
				</td>
				<td>
					<CaretSize Size={MaxSize ?? 0} handleInput={this.HandleInput} />
				</td>
			</tr>
		);
	}

	componentDidMount() {
		const { Observer } = this.props;
		Observer.SetComponent(this);
	}
}
