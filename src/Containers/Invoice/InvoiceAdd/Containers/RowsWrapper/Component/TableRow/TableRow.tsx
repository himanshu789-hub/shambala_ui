import CaretSize from 'Components/CaretSize/CaretSize';
import React, { ChangeEvent } from 'react';
import { ProductInfo } from 'Types/Mediator';
import { Flavour, SoldItem } from 'Types/DTO';
import Observer from 'Utilities/Observer';
import './TableRow.css';

type TableRowProps = {
	handleChange: (componentId: number, name: string, value: any) => void;
	ComponentId: number;
	GetObserver(componentId: number): Observer;
	HandleDelete: (componentId: number) => void;
	Item: SoldItem;
};
type TableRowState = {
	ProductInfo: ProductInfo[];
	QuantityLimit: number;
	Flavours: Flavour[];
};
export default class TableRow extends React.PureComponent<TableRowProps, TableRowState> {
	constructor(props: TableRowProps) {
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

			const { GetObserver } = this.props;
			const Observer = GetObserver(ComponentId);
			switch (name) {
				case 'ProductId':
					Observer.Unubscribe();
					Observer.SetProduct(val);
					console.log('Going To Handle CHange Within TableRow');

					handleChange(ComponentId, name, val)

					break;
				case 'FlavourId':
					Observer.SetFlavour(val);
					const QuantityLimit = Observer.GetQuantityLimit() as number;
					this.setState({ QuantityLimit: QuantityLimit }, () => {
						console.log('Going To Handle CHange Within TableRow');
						handleChange(ComponentId, name, val)
					});
					break;
				default:
					break;
			}

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
		switch (name) {
			case 'FlavourId':
				if (this.props.Item.ProductId != -1)
					this.setState({ Flavours: Observer.GetFlavours() });
				break;
			case 'ProductId':
				this.setState({ ProductInfo: Observer.GetProduct() });
				break;
			default: break;
		}
	}
	componentWillReceiveProps(nextProps: TableRowProps) {
		// console.log("Recieve Some Props");
		// console.log('Is Item Reference Same : ',nextProps.Item==this.props.Item);
		// const { Item: OldItem } = this.props;
		// const { Item } = nextProps;
		// if (Item.Quantity != OldItem.Quantity || Item.FlavourId != OldItem.FlavourId || Item.ProductId != OldItem.ProductId || Item.CaretSize != OldItem.CaretSize) {
		// 	this._propsState = ComponentPropsChanged.Yes;
		// 	console.log('Yes,Got SOme CHanges');
		// 	debugger;
		// } else
		// 	this._propsState = ComponentPropsChanged.No;
	}
	// shouldComponentUpdate() {
	// 	// const PropsState = this._propsState.toString();
	// 	// this._propsState = ComponentPropsChanged.Reset;

	// 	// if (PropsState == ComponentPropsChanged.No.toString())
	// 	// 	return false;
	// 	return true;
	// }
	componentDidUpdate() {
		console.log('Table Row Updating');
	}
	render() {
		const { ProductInfo, QuantityLimit, Flavours: Flavours } = this.state;
		const { Item: { ProductId, FlavourId, CaretSize: MaxSize,Quantity } } = this.props;

		return (
			<tr className="table-row">
				<td>
					<select
						className={`form-control ${ProductId == -1 ? 'is-invalid' : ''}`}
						name='ProductId'
						value={ProductId}
						onChange={this.HandleChange}
						onFocus={this.HandleClick}>

						<option disabled value='-1'>
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
						onChange={this.HandleChange} onFocus={this.HandleClick}>
						<option disabled value='-1'>-- Select A Flavour -- </option>
						{Flavours.map(e => (
							<option key={e.Id} value={e.Id}>
								{e.Title}
							</option>
						))}
					</select>
				</td>
				<td>
					<input className={`form-control ${MaxSize == 0 ? 'is-invalid' : ''}`} value={MaxSize} readOnly />
				</td>
				<td className="caret">
					{/* <CaretSize  Size={MaxSize ?? 0} handleInput={this.HandleInput} MaxLimit={QuantityLimit} OnFocusIn={this.HandleFocus} Quantity={Quantity}/> */}
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
