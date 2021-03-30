import React, { ChangeEvent, SyntheticEvent } from 'react';
import { CaretDetails, Flavour } from 'Types/Product';
import { IShipmentElement } from 'Types/ShipmentElement';
import CaretSizeInput from 'Components/CaretSize/CaretSize';
import { provideValidNumber } from 'Utilities/Utilities';
import './ShipmentElement.css';
import { ShipmentProperty } from 'Types/types';
import {ProductKeyWithName} from 'Types/types';
type IShipmentElementProps = {
	ShipmentEntity: IShipmentElement;
	handleChange: (property: ShipmentProperty) => void;
	ProductList: ProductKeyWithName[];
	SelectProductCaretDetails: (Id: string) => CaretDetails[];
	SetQuantity: Function;
	handleRemove: Function;
	flavourList: Flavour[];
	limit:number;
};
type IShipmentElementState = {};
export default class ShipmentElement extends React.Component<IShipmentElementProps, IShipmentElementState> {
	constructor(props: IShipmentElementProps) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}
	setQuantity = (totalQuantity: number) => {
		const {
			SetQuantity,
			ShipmentEntity: { Id },
		} = this.props;

		SetQuantity(Id, totalQuantity);
	};
	handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
		const Id = this.props.ShipmentEntity.Id;
		const Name = e.currentTarget.name;
		let Value: any = e.currentTarget.value;

		if (Name && Value != undefined) {
			const { handleChange } = this.props;
			if (Name == 'TotalDefectedPieces') Value = provideValidNumber(Value);

			handleChange({ Id, Name, Value });
		}
	}
	render() {
		const { ProductList, ShipmentEntity, SelectProductCaretDetails, handleRemove, flavourList } = this.props;
		const CaretDetails = SelectProductCaretDetails(ShipmentEntity.ProductId + '');
		const caretSize = ShipmentEntity.CaretSize;
		return (
			<div className='incoming-shipment-element-add d-flex  justify-content-around flex-nowrap'>
				<div className={`form-group ${!ShipmentEntity.ProductId ? 'is-invalid' : ''}`}>
					<label htmlFor='product'>Product Name</label>
					<select className='form-control' value={ShipmentEntity.ProductId} data-src={ShipmentEntity.Id} name='ProductId' onChange={this.handleChange}>
						<option value='0' disabled >
							-- Select Your Option --
						</option>
						{Array.from(ProductList).map(value => (
							<option value={value.Id} key={value.Id} >
								{value.Name}
							</option>
						))}
					</select>
					<div className='invalid-feedback'>Please, Select a Product!</div>
				</div>
				<div className={`form-group ${ShipmentEntity.FlavourId}`}>
					<label htmlFor='flavour'>Flavour</label>
					<select name="FlavourId" onChange={this.handleChange} value={ShipmentEntity.FlavourId}>
						<option  disabled  value='-1'>-- Select Your Option --</option>
						{flavourList &&
							flavourList.length > 0 &&
							flavourList.map(e => (
								<option value={e.Id} >
									{e.Title}
								</option>
							))}
					</select>
				</div>
				<div className={`form-group ${ShipmentEntity.CaretSize == 0 ? 'is-invalid' : ''}`}>
					<label htmlFor='caretSize'>CaretSize</label>
					<select className='form-control' name='CaretSize' onChange={this.handleChange} placeholder='Select Caret Size'>
						{CaretDetails &&
							CaretDetails.length > 0 &&
							CaretDetails.map((value, index) => (
								<option value={value.CaretSize} key={index} defaultChecked={caretSize == value.CaretSize}>
									{value.CaretSize}
								</option>
							))}
					</select>
					<div className='invalid-feedback'>Product Not Selected!</div>
				</div>

				<CaretSizeInput Size={caretSize} handleInput={this.setQuantity} Limit={this.props.limit}/>
				<div className='form-group'>
					<label>Defected Pieces</label>
					<input
						name='TotalDefectedPieces'
						className='form-control'
						value={ShipmentEntity.TotalDefectedPieces}
						onChange={this.handleChange}
					/>
				</div>
				<div className='form-group'>
					<i className='fa fa-minus-square text-danger' onClick={() => handleRemove(ShipmentEntity.Id)}></i>
				</div>
			</div>
		);
	}
}
