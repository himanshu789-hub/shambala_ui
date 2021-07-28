import React, { ChangeEvent, SyntheticEvent } from 'react';
import { Product, Flavour, ShipmentDTO, OutOfStock } from 'Types/DTO';
import MediatorSubject from 'Utilities/MediatorSubject';
import { addDanger, addWarn } from 'Utilities/AlertUtility';
import { InitialShipment } from 'Types/Types';
import { AgGridReact } from '@ag-grid-community/react';
import { GridGetterParams, GridRowDataTransaction, IRowValue } from 'Components/AgGridComponent/Grid';
import { GridOptions, GridReadyEvent, RowDataTransaction } from '@ag-grid-community/all-modules';
import { FlavourCellRenderer, FlavourValueGetter, FlavourValueSetter, ProductCellRenderer, ProductValueGetter, ProductValueSetter } from 'Components/AgGridComponent/Renderer/SelectWithAriaRender';
import { GridFlavourSelectEditor, GridProductSelectEditor } from 'Components/AgGridComponent/Editors/SelectWithAriaEditor';
import CaretSizeRender, { CaretSizeValueGetter, CaretSizeValueSetter } from 'Components/AgGridComponent/Renderer/CaretSizeRenderer';
import { CaretSizeEditor } from 'Components/AgGridComponent/Editors/CaretSizeEditor';
import ActionCellRenderer, { ActionCellParams } from 'Components/AgGridComponent/Renderer/ActionCellRender';
import { getARandomNumber } from 'Utilities/Utilities';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import Action from 'Components/Action/Action';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules//dist/styles/ag-theme-alpine.css';
import { setTimeout } from 'node:timers';


type IShipmentListProps =
	{
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
		this.products = new Map([]);
		this.componentListMediator = new MediatorSubject([]);
		this.state = {
			ShipmentInfos: [],
			GridOptions: {
				columnDefs: [
					{
						cellRendererFramework: ProductCellRenderer,
						cellEditorFramework: GridProductSelectEditor,
						valueGetter: ProductValueGetter,
						valueSetter: ProductValueSetter,
						headerName: 'Product Name'
					},
					{
						cellRendererFramework: FlavourCellRenderer,
						cellEditorFramework: GridFlavourSelectEditor,
						valueGetter: FlavourValueGetter,
						valueSetter: FlavourValueSetter,
						headerName: 'Flavour Name'
					},
					{
						valueGetter: (props: GridGetterParams) => props.data.Shipment.CaretSize,
						editable: false,
						headerName: 'Caret Size'
					},
					{
						cellEditorFramework: CaretSizeEditor,
						cellRendererFramework: CaretSizeRender,
						valueGetter: CaretSizeValueGetter,
						valueSetter: CaretSizeValueSetter,
						headerName: 'Quantity'
					},
					{
						cellRendererFramework: ActionCellRenderer,
						cellRendererParams: {
							addAChild: this.addAShipment,
							deleteAChild: this.handleRemove
						} as ActionCellParams,
						headerName: 'Action'
					}
				],

			},
			Products: new Map([]),
			SubscriptionId: Math.random() * 10,
			Alert: { Message: "", Show: false }
		};
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
				this.componentListMediator = new MediatorSubject(Products);
					this.setState({ Products: products, ShipmentInfos: [this.createAShipment(getARandomNumber())] });
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
	createAShipment = (Id: number): IRowValue => {
		return {
			Shipment: { Id: Id, CaretSize: 0, FlavourId: -1, ProductId: -1, TotalDefectedPieces: 0, TotalRecievedPieces: 0 },
			Observer: this.componentListMediator.GetAObserver(this.state.SubscriptionId, Id)
		};
	}
	addAShipment = () => {
		const { Products } = this.state;
		const componentId = getARandomNumber();
		if (Products.size != 0) {
			const rowTransations: GridRowDataTransaction = {
				add: [this.createAShipment(componentId)], addIndex: 0
			};
			this.state.GridOptions.api?.applyTransaction(rowTransations);
		}
		else
			addDanger("Product Not Availabel");
	};
	private OnGridReady = (params: GridReadyEvent) => {
		this.setState((prevState) => ({ GridOptions: { ...prevState.GridOptions, api: params.api, columnApi: params.columnApi } }));
	}
	selectProductCaretDetails = (Id: number): number => {
		let product = this.products.get(Id + '');
		if (product) return product.CaretSize;
		return 0;
	};
	componentWillUpdate() {
		debugger;
	}
	handleRemove = (Id: number) => {
		const { GridOptions } = this.state;
		const GridTransaction: GridRowDataTransaction = {
			remove: [{ Id: Id }]
		}
		GridOptions.api?.applyTransaction(GridTransaction);
	}
	render() {
		const { ShipmentInfos,GridOptions } = this.state;

		return (<div className="ag-theme-alpine" style={{ height: '500px', width: '100vw' }}>
			<AgGridReact modules={AllCommunityModules} singleClickEdit={true} gridOptions={GridOptions}
				rowData={ShipmentInfos} onGridReady={this.OnGridReady}>
			</AgGridReact>
			<Action handleAdd={this.addAShipment} handleProcess={this.handleSubmit} />
		</div>);
	}
}
