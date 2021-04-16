import CaretSize from 'Components/CaretSize/CaretSize';
import React, { ChangeEvent } from 'react';
import { ProductInfo } from 'Types/Mediator';
import { Flavour } from 'Types/Types';
import Observer from 'Utilities/Observer';
import './TableRow.css';

type ItemsHolderProps = {
	handleChange: (componentId: number, name: string, value: any) => void;
	CaretSize?: number;
	ComponentId: number;
	Observer: Observer;
	HandleDelete:(componentId:number)=>void;
};
type ItemHolderState = {
	ProductInfo: ProductInfo[];
	ProductId: number;
	QuantityLimit: number;
	FlavourId: number;
	Flavours: Flavour[];
};
export default class TableRow extends React.Component<ItemsHolderProps, ItemHolderState> {
	constructor(props: ItemsHolderProps) {
		super(props);
		this.state = {
			Flavours: [],
			ProductId: -1,
			FlavourId: -1,
			QuantityLimit: -1,
			ProductInfo: props.Observer.GetProduct(),
		};
	}
	Delete=()=>{
		const {Observer,ComponentId,HandleDelete} = this.props;
		Observer.Unubscribe();
		HandleDelete(ComponentId);
	}
	HandleFocus = ()=>{
		const {Observer} = this.props;
		Observer.UnsubscribeToQuantity();
		this.setState({QuantityLimit:Observer.GetQuantityLimit()})
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
		const { handleChange, ComponentId, Observer } = this.props;

		Observer.UnsubscribeToQuantity();
		handleChange(ComponentId, 'Quantity', num);
		Observer.SetQuantity(num);
		
	};
	HandleClick=(e:React.FocusEvent<HTMLSelectElement>)=>{
       const {Observer} = this.props;
       const {  currentTarget : {name}} = e;
	   console.log(name+' Click Event Triggers');
	   switch(name){
		   case 'FlavourId':
		   this.setState({Flavours:Observer.GetFlavours()});
		   break;
		   case 'ProductId':
		   this.setState({ProductInfo:Observer.GetProduct()});
		   break;
		   default: break;
	   }            
	}
	render() {
		const { ProductInfo, QuantityLimit,Flavours: Flavours, FlavourId: SelectedFlavour, ProductId: SelectedProduct } = this.state;
		const { CaretSize: MaxSize,Observer } = this.props;

		return (
			<tr>
				<td>
					<select
						className={`form-control ${SelectedProduct == -1 ? 'is-invalid' : ''}`}
						name='ProductId'
						value={SelectedProduct}
						onChange={this.HandleChange}
						 onFocus={this.HandleClick}>
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
					<select
						className={`form-control ${SelectedFlavour == -1 ? 'is-invalid' : ''}`}
						name='FlavourId'
						value={SelectedFlavour}
						onChange={this.HandleChange} onFocus={this.HandleClick}>
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
					<input className={`form-control ${MaxSize == 0 ? 'is-invalid' : ''}`} value={MaxSize} />
				</td>
				<td>
					<CaretSize Size={MaxSize ?? 0} handleInput={this.HandleInput} Limit={QuantityLimit} OnFocusIn={this.HandleFocus}/>
				</td>
				<td>
					<button onClick={this.Delete} className="btn btn-light w-100"><i className="fa fa-trash"></i></button>
				</td>
			</tr>
		);
	}

	componentDidMount() {
		const { Observer } = this.props;
		Observer.SetComponent(this);
	}
}
