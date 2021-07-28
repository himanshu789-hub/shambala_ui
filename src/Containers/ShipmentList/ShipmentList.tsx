import React, { ChangeEvent, SyntheticEvent } from 'react';
import { Product, Flavour, ShipmentDTO, OutOfStock } from 'Types/DTO';
import MediatorSubject from 'Utilities/MediatorSubject';
import { addDanger, addWarn } from 'Utilities/AlertUtility';
import { InitialShipment } from 'Types/Types';
import { AgGridColumn, AgGridReact } from '@ag-grid-community/react';
import { GridGetterParams, IRowValue } from 'Components/AgGridComponent/Grid';
import { GridOptions } from '@ag-grid-community/all-modules';
import { FlavourCellRenderer, FlavourValueGetter, FlavourValueSetter, ProductCellRenderer, ProductValueGetter, ProductValueSetter } from 'Components/AgGridComponent/Renderer/SelectWithAriaRender';
import { GridFlavourSelectEditor, GridProductSelectEditor } from 'Components/AgGridComponent/Editors/SelectWithAriaEditor';
import CaretSizeRender, { CaretSizeValueGetter, CaretSizeValueSetter } from 'Components/AgGridComponent/Renderer/CaretSizeRenderer';
import { CaretSizeEditor } from 'Components/AgGridComponent/Editors/CaretSizeEditor';
import ActionCellRenderer, { ActionCellParams } from 'Components/AgGridComponent/Renderer/ActionCellRender';

type IShipmentListProps = {
	handleSubmit: (Shipments: ShipmentDTO[]) => void;
	Products: Product[];
	ShouldLimitQuantity: boolean;
	ResetElement?: OutOfStock[];
	InitialShipments?: InitialShipment[];
};
type IShipmentListState = {
	Products: Map<string, Product>;
	ShipmentInfos: Array<IRowValue>;
	SubscriptionId: number;
	Alert: { Show: boolean, Message: string };
	GridOptions: GridOptions;
};

export default class ShipmentList extends React.Component<IShipmentListProps, IShipmentListState> {
	products: Map<string, Product>;
	componentListMediator: MediatorSubject;
	constructor(props: IShipmentListProps) {
		super(props);
		this.state = {
			ShipmentInfos: [],
			GridOptions: {
				columnDefs: [
					{
						cellRendererFramework: ProductCellRenderer,
						cellEditorFramework: GridProductSelectEditor,
						valueGetter: ProductValueGetter,
						valueSetter: ProductValueSetter
					},
					{
						cellRendererFramework: FlavourCellRenderer,
						cellEditorFramework: GridFlavourSelectEditor,
						valueGetter: FlavourValueGetter,
						valueSetter: FlavourValueSetter
					},
					{
						valueGetter: (props: GridGetterParams) => props.data.Shipment.CaretSize,
						editable: false,
					},
					{
						cellEditorFramework: CaretSizeEditor,
						cellRendererFramework: CaretSizeRender,
						valueGetter: CaretSizeValueGetter,
						valueSetter: CaretSizeValueSetter
					},
					{
						cellRendererFramework: ActionCellRenderer,
						cellRendererParams: {
							addAChild: this.addAShipment,
							deleteAChild: this.handleRemove
						} as ActionCellParams
					}
				]
			},
			Products: new Map([]), SubscriptionId: Math.random() * 10, Alert: { Message: "", Show: false }
		};
		this.products = new Map([]);
		this.componentListMediator = new MediatorSubject([]);
		this.handleChange = this.handleChange.bind(this);
		this.addAShipment = this.addAShipment.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	componentWillReceiveProps(nextProps: IShipmentListProps) {
		if (nextProps.Products != this.props.Products) {
			const { Products } = nextProps;
			let products = new Map<string, Product>();
			if (Products != this.props.Products && Products.length > 0) {
				Products.forEach(function (value, index) {
					products.set(value.Id + '', value);
				});
				this.products = new Map(products);
				this.componentListMediator.Unsubscribe(this.state.SubscriptionId);
				this.componentListMediator = new MediatorSubject(Products.map(e => { return { ...e } }));
				this.setState({ Products: products, ShipmentInfos: [] });
			}
		}
		if (nextProps.ResetElement && nextProps.ResetElement != this.props.ResetElement) {
			const { ShipmentInfos } = this.state;
			this.componentListMediator.UnregisteredObserverWithQuantities(nextProps.ResetElement);
			const Shipments = ShipmentInfos.flatMap(e => e.Shipment);
			const Ids: number[] = [];
			for (let index = 0; index < Shipments.length; index++) {
				const element = Shipments[index];
				if (nextProps.ResetElement.find(e => e.FlavourId == element.FlavourId && e.ProductId == element.ProductId))
					Ids.push(element.Id);
			}
			this.setState(({ ShipmentInfos }) => {
				return {
					ShipmentInfos: ShipmentInfos.map(e => {
						if (Ids.find(i => i == e.Shipment.Id))
							return { ...e, Shipment: { ...e.Shipment, TotalRecievedPieces: 0, TotalDefectedPieces: 0 } };
						return e;
					})
				}
			});
		}

		const { InitialShipments } = nextProps;
		if (InitialShipments && InitialShipments != this.props.InitialShipments) {
			const ShipmentInfos: Array<IRowValue> = [];

			for (var i = 0; i < InitialShipments.length; i++) {
				const Id = Math.random();
				const observer = this.componentListMediator.GetAObserver(this.state.SubscriptionId, Id);
				const initial = InitialShipments[i]; const shipment = initial.Shipment;
				observer.SetProduct(shipment.ProductId);
				observer.SetFlavour(shipment.FlavourId);
				const quantity = shipment.TotalRecievedPieces > observer.GetQuantityLimit() ? 0 : shipment.TotalRecievedPieces;
				observer.SetQuantity(quantity);
				ShipmentInfos.push({ Observer: observer, Shipment: { ...shipment, TotalRecievedPieces: quantity }, MaxLimit: initial.MaxLimit, MinLimit: initial.MinLimit });
			}
			this.setState({ ShipmentInfos: ShipmentInfos });
		}
	}

	handleChange(propertyValue: { Id: number; Name: string; Value: any }) {
		const { Id, Name, Value } = propertyValue;
		const { ShouldLimitQuantity } = this.props;

		if (Name == 'ProductId') {
			const ProductId = Number.parseInt(Value);

			this.setState(({ ShipmentInfos }) => {
				return {
					ShipmentInfos:
						ShipmentInfos.map(e => {
							if (e.Shipment.Id == Id) {
								e.Shipment.FlavourId && e.Observer.UnsubscribeToQuantity()
								return { ...e, Shipment: { ...e.Shipment, ProductId: ProductId, FlavourId: -1, CaretSize: this.selectProductCaretDetails(ProductId) }, MaxLimit: ShouldLimitQuantity ? 0 : undefined };
							}
							return e;
						}),

				};
			});
		} else if (Name == 'FlavourId') {
			this.setState(({ ShipmentInfos }) => {
				return {
					ShipmentInfos: [
						...ShipmentInfos.map(e => {
							if (e.Shipment.Id == Id) {
								return { ...e, Shipment: { ...e.Shipment, FlavourId: Value }, MaxLimit: ShouldLimitQuantity ? e.Observer.GetQuantityLimit() : undefined };
							}
							return { ...e };
						}),
					],
				};
			});
		}
		else {
			this.setState(({ ShipmentInfos: IncomingShipments }) => {
				return {
					ShipmentInfos: [
						...IncomingShipments.map(value => {
							if (value.Shipment.Id == Id)
								return { ...value, Shipment: { ...value.Shipment, [Name]: Value } };
							return value;
						}),
					],
				};
			});
		}
	}
	handleSubmit() {
		const element = document.getElementsByClassName('is-invalid');
		if (element.length > 0) {
			addWarn("Please Fill Detail Properly!");
		} else {
			console.log('Valid Form');

			const { handleSubmit } = this.props;
			const { ShipmentInfos: Shipments } = this.state;
			if (Shipments.length > 0)
				handleSubmit(Shipments.map(e => e.Shipment));
			else
				addWarn("Please, Add Atleast One Item");
		}
	}
	addAShipment = () => {
		const { ShipmentInfos, Products, SubscriptionId } = this.state;
		const componentId = Math.floor(Math.random() * 1000);
		const Observer = this.componentListMediator.GetAObserver(SubscriptionId, componentId);
		if (Products.size != 0)
			this.setState({
				ShipmentInfos: [
					...ShipmentInfos,
					{
						Observer,
						Shipment: {
							Id: componentId,
							ProductId: -1,
							TotalDefectedPieces: 0,
							FlavourId: -1,
							CaretSize: 0,
							TotalRecievedPieces: 0,
						}
					},
				],
			});
		else
			addDanger("Product Not Availabel");
	};
	resetQuantityLimit = (Id: number) => {
		this.setState(({ ShipmentInfos }) => {
			return {
				ShipmentInfos: ShipmentInfos.map(e => {
					if (e.Shipment.Id == Id) {
						e.Observer.UnsubscribeToQuantity();
						return { ...e, Shipment: { ...e.Shipment }, MaxLimit: e.Observer.GetQuantityLimit() };
					}
					return e;
				})
			}
		})
	}
	selectProductCaretDetails = (Id: number): number => {
		let product = this.products.get(Id + '');
		if (product) return product.CaretSize;
		return 0;
	};
	setQuantity = (Id: number, quantity: number) => {
		this.handleChange({ Id, Name: 'TotalRecievedPieces', Value: quantity });
	};
	handleRemove = (Id: number) => {
		const { ShipmentInfos, SubscriptionId } = this.state;
		const currentShipmentElement = ShipmentInfos.find(e => e.Shipment.Id == Id);
		if (currentShipmentElement) {
			this.componentListMediator?.UnsubscribeAComponent(SubscriptionId, Id);
		}
		this.setState(({ ShipmentInfos: IncomingShipments }) => {
			return { ShipmentInfos: IncomingShipments.filter(e => e.Shipment.Id != Id) };
		});
	}
	render() {
		const { ShipmentInfos: IncomingShipments } = this.state;
		return <AgGridReact rowData={this.state.ShipmentInfos} gridOptions={this.state.GridOptions}>
		</AgGridReact>;
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
