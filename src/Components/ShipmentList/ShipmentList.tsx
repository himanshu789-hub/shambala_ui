import React, { ChangeEvent, SyntheticEvent } from 'react';
import Action from 'Components/Action/Action';
import { CaretDetails, Flavour, Product,IShipmentElement } from 'Types/Types';
import ShipmentElement from 'Components/ShipmentElement/ShipmentElement';
import ComponentProductListProvider from 'Utilities/ComponentProductListProvider';

type IShipmentListProps = {
	handleSubmit: (Shipments:IShipmentElement[])=>void;
	Products: Product[];
	ShouldLimitQuantity: boolean;
};
type IShipmentListState = {
	Products: Map<string, Product>;
	Shipments: Array<IShipmentElement>;
};

export default class ShipmentList extends React.Component<IShipmentListProps, IShipmentListState> {
	_products: Map<string, Product>;
	_componentListProvider?: ComponentProductListProvider;
	constructor(props: IShipmentListProps) {
		super(props);
		this.state = {
			Shipments: [],
			Products: new Map([]),
		};
		this._products = new Map([]);
		this.handleChange = this.handleChange.bind(this);
		this.addAShipment = this.addAShipment.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	componentWillReceiveProps(nextProps: IShipmentListProps) {
		if (nextProps != this.props) {
			const { Products } = nextProps;
			let products = new Map<string, Product>();
			if (Products.length > 0) {
				Products.forEach(function (value, index) {
					products.set(value.Id + '', value);
				});
				this._products = new Map(products);
				this._componentListProvider = new ComponentProductListProvider([
					...Products.map(e => {
						return { ...e };
					}),
				]);
				this.setState({ Products: products });
			}
		}
	}
	handleChange(propertyValue: { Id: number; Name: string; Value: any }) {
		const { Shipments: IncomingShipments } = this.state;
		const { Id, Name, Value } = propertyValue;

		if (Name == 'ProductId') {
			const componentMediator = this._componentListProvider as ComponentProductListProvider;
			const ProductId = Number.parseInt(Value);
			componentMediator.setASubscription(Id, ProductId);
			this.setState(({ Shipments: IncomingShipments }) => {
				return {
					Shipments: [
						...IncomingShipments.map(e => {
							if (e.Id == Id) {
								const FlavourId = e.ProductId != ProductId ? -1 : e.FlavourId;
								return {
									...e,
									ProductId: ProductId,
									FlavourId,
									CaretSize: this._products.get(Value + '')?.Carets[0].CaretSize ?? 0,
								};
							}
							return { ...e };
						}),
					],
				};
			});
		} else if (Name == 'FlavourId') {
			const ProductId = IncomingShipments.find(e => e.Id == Id)?.ProductId as number;
			(this._componentListProvider as ComponentProductListProvider).subscribedToFlavourId(Id, ProductId, Number.parseInt(Value));
			this.setState(({ Shipments: IncomingShipments }) => {
				return {
					Shipments: [
						...IncomingShipments.map(e => {
							if (e.Id == Id) {
								return { ...e, FlavourId: Number.parseInt(Value) };
							}
							return { ...e };
						}),
					],
				};
			});
		} else {
			this.setState(({ Shipments: IncomingShipments }) => {
				return {
					Shipments: [
						...IncomingShipments.map(value => {
							if (value.Id == Id) return { ...value, [Name]: Value };
							else return value;
						}),
					],
				};
			});
		}
	}
	handleSubmit() {
		const element = document.getElementsByClassName('is-invalid');
		if (element.length > 0) {
			console.log('InValid Form');
		} else {
			const { handleSubmit } = this.props;
			const {Shipments} = this.state;
			handleSubmit(Shipments);
			console.log('Valid Form');
		}
	}
	addAShipment = () => {
		const { Shipments: IncomingShipments, Products } = this.state;
		if (Products.size)
			this.setState({
				Shipments: [
					...IncomingShipments,
					{
						Id: Math.random(),
						ProductId: 0,
						TotalDefectedPieces: 0,
						FlavourId: -1,
						CaretSize: 0,
						TotalRecivedPieces: 0,
					},
				],
			});
	};
	selectProductCaretDetails = (Id: string): CaretDetails[] => {
		let product = this._products.get(Id);
		if (product) return product.Carets;
		return [];
	};
	setQuantity = (Id: number, quantity: number) => {
		this.handleChange({ Id, Name: 'TotalReceivedPieces', Value: quantity });
	};
	handleRemove = (Id: number) => {
		const { Shipments: IncomingShipments } = this.state;
		const currentShipmentElement = IncomingShipments.find(e => e.Id == Id);
		if (currentShipmentElement) {
			this._componentListProvider?.unsubscribeSubscription(currentShipmentElement.Id);
		}
		this.setState(({ Shipments: IncomingShipments }) => {
			return { Shipments: [...IncomingShipments.filter(e => e.Id != Id)] };
		});
	};
	render() {
		const { Shipments: IncomingShipments } = this.state;

		return (
			<div className='add p-3'>
				<div className='d-flex justify-content-start flex-column'>
					{IncomingShipments &&
						this._componentListProvider &&
						IncomingShipments.map((value, index) => {
							const mediator = this._componentListProvider as ComponentProductListProvider;
							const componentList = mediator.provideProductListBySubscriptionId(value.Id);
							const flavourList = this._componentListProvider?.getFlavours(value.Id) ?? [];
							let limit = mediator.getFlavourLimit(value.ProductId, value.FlavourId);
							return (
								<ShipmentElement
									key={value.Id}
									ProductList={componentList}
									handleChange={this.handleChange}
									flavourList={flavourList}
									ShipmentEntity={value}
									limit={limit}
									SetQuantity={this.setQuantity}
									handleRemove={this.handleRemove}
									SelectProductCaretDetails={this.selectProductCaretDetails}
								/>
							);
						})}
				</div>
				<Action handleAdd={this.addAShipment} handleProcess={this.handleSubmit} />
			</div>
		);
	}
}
