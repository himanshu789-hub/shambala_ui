import React, { ChangeEvent, SyntheticEvent } from 'react';
import CaretSizeInput from 'Components/CaretSize/CaretSize';
import { provideValidInteger } from 'Utilities/Utilities';
import './ShipmentElement.css';
import { ShipmentProperty } from 'Types/Types';
import { Flavour, ShipmentDTO } from 'Types/DTO';
import Observer from 'Utilities/Observer';
import { ProductInfo } from 'Types/Mediator';
import ReactSelect from 'Components/Select/Select';

type ShipmentElementProps = {
	ShipmentEntity: ShipmentDTO;
	handleChange: (property: ShipmentProperty) => void;
	Observer: Observer;
	SetQuantity: Function;
	handleRemove: Function;
	MaxLimit?: number;
	MinLimit?:number;
};
type ShipmentElementState = {
	ProductList: ProductInfo[];
	FlavourList: Flavour[];
};
export default class ShipmentElement extends React.PureComponent<ShipmentElementProps, ShipmentElementState> {
	constructor(props: ShipmentElementProps) {
		super(props);
		this.state = {
			ProductList: [], FlavourList: []
		}
		this.handleChange = this.handleChange.bind(this);
	}
	setQuantity = (totalQuantity: number) => {
		const {
			SetQuantity,
			Observer, MaxLimit: Limit,
			ShipmentEntity: { Id },
		} = this.props;
		Limit && Observer.SetQuantity(totalQuantity);
		SetQuantity(Id, totalQuantity);
	};
	handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
		const Id = this.props.ShipmentEntity.Id;
		const { Observer } = this.props;
		const Name = e.currentTarget.name;
		let Value: any = e.currentTarget.value;

		if (Name && Value != undefined) {
			const { handleChange, } = this.props;
			if (Name == 'TotalDefectedPieces')
				Value = provideValidInteger(Value);
			else if (Name == "ProductId" || Name == "FlavourId") {
				Value = Number.parseInt(Value);
				if (Name == "ProductId") {
					Observer.SetProduct(Value);
				}
				else {
					Observer.SetFlavour(Value);
				}
			}
			handleChange({ Id, Name, Value });
		}
	}
	handleClick = (e: React.FocusEvent<HTMLSelectElement>) => {
		const { currentTarget: { name, value } } = e;
		const { Observer } = this.props;
		if (name == "ProductId")
			this.setState({ ProductList: Observer.GetProduct() });
		else if (name == "FlavourId")
			this.setState({ FlavourList: Observer.GetFlavours() });
	}
	handleFocusIn = () => {

	}
	render() {
		const { ShipmentEntity, handleRemove, MaxLimit: Limit,MinLimit } = this.props;
		const { ProductList, FlavourList, } = this.state;
		const caretSize = ShipmentEntity.CaretSize;
		return (
			<div className='incoming-shipment-element-add d-flex  justify-content-around flex-nowrap'>
				<div className={`form-group ${!ShipmentEntity.ProductId ? 'is-invalid' : ''}`}>
					<label htmlFor='product'>Product Name</label>
					{/* <select
						className='form-control'
						value={ShipmentEntity.ProductId}
						data-src={ShipmentEntity.Id}
						name='ProductId'
						onFocus={this.handleClick}
						onChange={this.handleChange}>
						<option value='-1' disabled key={-1}>
							-- Select Your Option --
						</option>
						{Array.from(ProductList).map(value => (
							<option value={value.Id} key={value.Id}>
								{value.Title}
							</option>
						))}
					</select> */}
					<ReactSelect list={ProductList.map(e=>{return {label:e.Title,value:e.Id}})}/>
					<div className='invalid-feedback'>Please, Select a Product!</div>
				</div>
				<div className={`form-group ${ShipmentEntity.FlavourId}`}>
					<label htmlFor='flavour'>Flavour</label>
					<select
						name='FlavourId'
						id='flavour'
						className='form-control'
						onChange={this.handleChange}
						onFocus={this.handleClick}
						value={ShipmentEntity.FlavourId}>
						<option disabled value='-1'>
							-- Select Your Option --
						</option>
						{FlavourList && FlavourList.map(e => <option value={e.Id} key={e.Id}>{e.Title}</option>)}
					</select>
				</div>
				<div className={`form-group ${ShipmentEntity.CaretSize == 0 ? 'is-invalid' : ''}`}>
					<label htmlFor='caretSize'>CaretSize</label>
					<input className="form-control" disabled value={ShipmentEntity.CaretSize} />
					<div className='invalid-feedback'>Product Not Selected!</div>
				</div>
				<div className={`form-group`}>
					<label htmlFor='caretSize'>Quantity</label>
					<CaretSizeInput Size={caretSize} handleInput={this.setQuantity} MaxLimit={Limit}  MinLimit={MinLimit}
						Quantity={ShipmentEntity.TotalRecievedPieces} OnFocusIn={this.handleFocusIn} />
				</div>

				<div className={`form-group ${ShipmentEntity.TotalDefectedPieces >= ShipmentEntity.TotalRecievedPieces && "is-invalid"}`}>
					<label>Defected Pieces</label>
					<input
						name='TotalDefectedPieces'
						className='form-control'
						value={ShipmentEntity.TotalDefectedPieces}
						onChange={this.handleChange}
					/>
					<small className="invalid-feedback">Cannot Be Greater Than Quantity</small>
				</div>
				<div className='form-group'>
					<i className='fa fa-minus-square text-danger' onClick={() => handleRemove(ShipmentEntity.Id)}></i>
				</div>
			</div>
		);
	}
}
