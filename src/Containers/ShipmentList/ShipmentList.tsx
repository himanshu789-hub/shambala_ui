import React, { ChangeEvent, SyntheticEvent } from 'react';
import Action from 'Components/Action/Action';
import { CaretDetails } from 'Types/Types';
import ShipmentElement from 'Containers/ShipmentList/Component/ShipmentElement/ShipmentElement';
import ComponentProductListProvider from 'Utilities/ComponentProductListProvider';
import { Product, Flavour, ShipmentDTO } from 'Types/DTO';
import MediatorSubject from 'Utilities/MediatorSubject';
import Observer from 'Utilities/Observer';
type IShipmentListProps = {
	handleSubmit: (Shipments: ShipmentDTO[]) => void;
	Products: Product[];
	ShouldLimitQuantity: boolean;
};
type ShipmentInfo = {
	Shipment: ShipmentDTO;
	Observer: Observer;
}
type IShipmentListState = {
	Products: Map<string, Product>;
	ShipmentInfos: Array<ShipmentInfo>;
	SubscriptionId: number;
};

export default class ShipmentList extends React.Component<IShipmentListProps, IShipmentListState> {
	products: Map<string, Product>;
	componentListMediator: MediatorSubject;
	constructor(props: IShipmentListProps) {
		super(props);
		this.state = {
			ShipmentInfos: [],
			Products: new Map([]), SubscriptionId: Math.random() * 10
		};
		this.products = new Map([]);
		this.componentListMediator = new MediatorSubject([]);
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
				this.products = new Map(products);
				this.componentListMediator = new MediatorSubject(Products.map(e => { return { ...e } }));
				this.setState({ Products: products });
			}
		}
	}
	handleChange(propertyValue: { Id: number; Name: string; Value: any }) {
		const { ShipmentInfos, SubscriptionId } = this.state;
		const { Id, Name, Value } = propertyValue;

		if (Name == 'ProductId') {
			const ProductId = Number.parseInt(Value);
			this.setState(({ ShipmentInfos }) => {
				return {
					ShipmentInfos:
						ShipmentInfos.map(e => {
							if (e.Shipment.Id == Id)
								return { ...e, Shipment: { ...e.Shipment, ProductId: ProductId, CaretSize: this.selectProductCaretDetails(ProductId) } };
							return e;
						}),

				};
			});
		} else if (Name == 'FlavourId') {
			const ShipmentInfo = ShipmentInfos.find(e => e.Shipment.Id == Id) as ShipmentInfo;
			this.setState(({ ShipmentInfos: IncomingShipments }) => {
				return {
					ShipmentInfos: [
						...IncomingShipments.map(e => {
							if (e.Shipment.Id == Id) {
								return { ...e, FlavourId: Number.parseInt(Value) };
							}
							return { ...e };
						}),
					],
				};
			});
		} else {
			this.setState(({ ShipmentInfos: IncomingShipments }) => {
				return {
					ShipmentInfos: [
						...IncomingShipments.map(value => {
							if (value.Shipment.Id == Id) return { ...value, [Name]: Value };
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
			const { ShipmentInfos: Shipments } = this.state;
			handleSubmit(Shipments.map(e => e.Shipment));
			console.log('Valid Form');
		}
	}
	addAShipment = () => {
		const { ShipmentInfos: IncomingShipments, Products,SubscriptionId } = this.state;
		const componentId = Math.floor(Math.random() * 1000);
		const Observer = this.componentListMediator.GetAObserver(SubscriptionId,componentId);
		if (Products.size!=0)
			this.setState({
				ShipmentInfos: [
					...IncomingShipments,
					{
						Observer,
						Shipment: {
							Id: componentId,
							ProductId: 0,
							TotalDefectedPieces: 0,
							FlavourId: -1,
							CaretSize: 0,
							TotalRecievedPieces: 0,
						}
					},
				],
			});
	};
	selectProductCaretDetails = (Id: number): number => {
		let product = this.products.get(Id + '');
		if (product) return product.CaretSize;
		return 0;
	};
	setQuantity = (Id: number, quantity: number) => {

		this.handleChange({ Id, Name: 'TotalRecievedPieces', Value: quantity });
	};
	handleRemove = (Id: number) => {
		const { ShipmentInfos,SubscriptionId } = this.state;
		const currentShipmentElement = ShipmentInfos.find(e => e.Shipment.Id == Id);
		if (currentShipmentElement) {
			this.componentListMediator?.UnsubscribeAComponent(SubscriptionId,Id);
		}
		this.setState(({ ShipmentInfos: IncomingShipments }) => {
			return { ShipmentInfos: IncomingShipments.filter(e => e.Shipment.Id != Id)};
		});
	};
	render() {
		const { ShipmentInfos: IncomingShipments } = this.state;

		return (
			<div className='add p-3'>
				<div className='d-flex justify-content-start flex-column'>
					{IncomingShipments  &&
						IncomingShipments.map((value, index) => {
							return (
								<ShipmentElement
									key={value.Shipment.Id}
									handleChange={this.handleChange}
									ShipmentEntity={value.Shipment}
									SetQuantity={this.setQuantity}
									handleRemove={this.handleRemove}
									Observer={value.Observer}
									shouldUseLimit={false}
								/>
							);
						})}
				</div>
				<Action handleAdd={this.addAShipment} handleProcess={this.handleSubmit} />
			</div>
		);
	}

	componentDidMount() {
		const { Products } = this.props;
		if (Products && Products.length > 0) {
			let products = new Map<string, Product>();
			if (Products.length > 0) {
				Products.forEach(function (value, index) {
					products.set(value.Id + '', value);
				});
				this.products = new Map(products);
				this.componentListMediator = new MediatorSubject(Products.map(e => { return { ...e }; }));
				this.setState({ Products: products });
			}
		}
	}
}
