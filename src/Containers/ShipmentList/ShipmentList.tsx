import React from 'react';
import { Product, ShipmentDTO, OutOfStock } from 'Types/DTO';
import MediatorSubject from 'Utilities/MediatorSubject';
import { addDanger, addWarn } from 'Utilities/AlertUtility';
import { InitialShipment } from 'Types/Types';
import { AgGridReact } from '@ag-grid-community/react';
import { ShipmentGridGetterParams, ShipmentGridDataTransation, IRowValue, GridContext, ShipmentGridRowNode, ShipmentGridSetter, ShipmentRendererParams, ShipmentRowValue, ShipmentGridEditorParams } from './ShipmentList.d';
import { GridOptions, GridReadyEvent, RowNode, ITooltipParams, Column } from '@ag-grid-community/all-modules';
import { FlavourCellRenderer, FlavourValueChangedEvent, FlavourValueGetter, FlavourValueSetter, ProductCellRenderer, ProductValueChangedEvent, ProductValueGetter, ProductValueSetter } from './Component/Renderer/Renderer';
import { GridSelectEditor } from 'Components/AgGridComponent/Editors/SelectWithAriaEditor';
import CaretSizeRenderer from 'Components/AgGridComponent/Renderer/CaretSizeRenderer';
import { CaretSizeCellValueChangeEvemt, CaretSizeEditor, CaretSizeEditorValueSetterParams } from 'Components/AgGridComponent/Editors/CaretSizeEditor';
import ActionCellRenderer, { ActionCellParams } from 'Components/AgGridComponent/Renderer/ActionCellRender';
import { getARandomNumber } from 'Utilities/Utilities';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import Action from 'Components/Action/Action';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules//dist/styles/ag-theme-alpine.css';
import { ToolTipComponent, ToolTipGetter } from 'Components/AgGridComponent/Renderer/ToolTipRenderer';
import CellClassSpecifier from 'Components/AgGridComponent/StyleSpeficier/ShipmentCellStyle';
import { ValidateShipment } from './../../Validation/ShipmentValidation';

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
const ToolTipValueGetter = (name: keyof ShipmentDTO) => ToolTipGetter<ShipmentDTO, ValidateShipment>(ValidateShipment, name);
const ClassRuleSpecifier = (name: keyof ShipmentDTO) => CellClassSpecifier<ShipmentDTO, ValidateShipment>(name, ValidateShipment);

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
				defaultColDef: {
					flex: 2,
					tooltipComponentFramework: ToolTipComponent,
					editable: true
				},
				columnDefs: [
					{
						cellRendererFramework: ProductCellRenderer,
						cellEditorFramework: GridSelectEditor<IRowValue, any>(e => e.Observer?.GetProduct().map(e => ({ label: e.Title, value: e.Id })), () => true),
						valueGetter: ProductValueGetter,
						valueSetter: ProductValueSetter,
						headerName: 'Product Name',
						onCellValueChanged: ProductValueChangedEvent,
						// @ts-ignore
						tooltipValueGetter: ToolTipValueGetter('ProductId'),
						cellStyle: ClassRuleSpecifier('ProductId')
					},
					{
						cellRendererFramework: FlavourCellRenderer,
						cellEditorFramework: GridSelectEditor<IRowValue, any>(e => (e.Observer?.GetFlavours().map(e => ({ label: e.Title, value: e.Quantity }) ?? [])), (data) => data.Shipment.ProductId != -1),
						valueGetter: FlavourValueGetter,
						valueSetter: FlavourValueSetter,
						headerName: 'Flavour Name',
						cellStyle: ClassRuleSpecifier('FlavourId'),
						onCellValueChanged: FlavourValueChangedEvent,
						// @ts-ignore
						tooltipValueGetter: ToolTipValueGetter('FlavourId')
					},
					{
						valueGetter: (props: ShipmentGridGetterParams) => props.data.Shipment.CaretSize,
						editable: false,
						headerName: 'Caret Size',
						//@ts-ignore
						tooltipValueGetter: ToolTipValueGetter('CaretSize'),
						cellStyle: ClassRuleSpecifier('CaretSize')
					},
					{
						cellEditorFramework: CaretSizeEditor<ShipmentGridEditorParams<ShipmentRowValue['TotalRecievedPieces']>>(e => e.data.Shipment.CaretSize, (e) => e.data.Shipment.ProductId !== -1),
						cellRendererFramework: CaretSizeRenderer<ShipmentRendererParams<ShipmentRowValue['TotalRecievedPieces']>>(e=>e.data.Shipment.CaretSize),
						valueGetter: (params: ShipmentGridGetterParams) => params.data.Shipment.TotalRecievedPieces,
						valueSetter: (props:CaretSizeEditorValueSetterParams<ShipmentGridSetter<ShipmentRowValue['TotalRecievedPieces']>>) => {
							props.data.Shipment.TotalRecievedPieces = props.newValue;
							return true;
						},
						headerName: 'Quantity',
						// @ts-ignore
						tooltipValueGetter: ToolTipValueGetter('TotalRecievedPieces'),
						cellStyle: ClassRuleSpecifier('TotalRecievedPieces')
					},
					{
						cellRendererFramework: ActionCellRenderer,
						cellRendererParams: {
							addAChild: this.addAShipment,
							deleteAChild: this.handleRemove
						} as ActionCellParams<string>,
						editable: false,
						headerName: 'Action',
						valueGetter: function (params: ShipmentGridGetterParams) {
							return params.data.Id;
						},
						flex: 1,
						tooltipComponentFramework: undefined
					}
				],
				tooltipShowDelay: 0,
				context: {
					getCartetSizeByProductId: this.getCaretSizeByProductId,
					getColumnIndex: this.getColummnIndex
				} as GridContext,
				getRowNodeId: function (data: IRowValue) {
					debugger;
					return data.Id + ''
				}
			},
			Products: new Map([]),
			SubscriptionId: Math.random() * 10,
			Alert: { Message: "", Show: false }
		};
		this.addAShipment = this.addAShipment.bind(this);
	}
	getColummnIndex(name: keyof ShipmentDTO) {
		let index = null;
		switch (name) {
			case 'ProductId': index = 0; break;
			case 'FlavourId': index = 1; break;
			case 'CaretSize': index = 2; break;
			case 'TotalRecievedPieces': index = 3; break;
			case 'Id': index = 4; break;
		}
		return index;
	}
	getCaretSizeByProductId = (Id: number) => {
		const { Products } = this.state;
		return Products.get(Id + '')?.CaretSize ?? 0;
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
				this.setState({ Products: products, ShipmentInfos: [this.createAShipment(1)] });
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
			// this.setState(({ ShipmentInfos }) => {
			// 	return {
			// 		ShipmentInfos: ShipmentInfos.map(e => {
			// 			if (Ids.find(i => i == e.Shipment.Id))
			// 				return { ...e, Shipment: { ...e.Shipment, TotalRecievedPieces: 0, TotalDefectedPieces: 0 } };
			// 			return e;
			// 		})
			// 	}
			// });
		}

		const { InitialShipments } = nextProps;
		if (InitialShipments && InitialShipments != this.props.InitialShipments) {
			const ShipmentInfos: Array<IRowValue> = [];
			for (var i = 0; i < InitialShipments.length; i++) {
				const Id = (i + 1);
				const observer = this.componentListMediator.GetAObserver(this.state.SubscriptionId, Id);
				const initial = InitialShipments[i]; const shipment = initial.Shipment;
				observer.SetProduct(shipment.ProductId);
				observer.SetFlavour(shipment.FlavourId);
				const quantity = shipment.TotalRecievedPieces > observer.GetQuantityLimit() ? 0 : shipment.TotalRecievedPieces;
				observer.SetQuantity(quantity);

				ShipmentInfos.push({ Observer: observer, Shipment: { ...shipment, TotalRecievedPieces: {Value:quantity,MaxLimit: initial.MaxLimit, MinLimit: initial.MinLimit }}, Id: Id+''  });
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
				handleSubmit(Shipments.map(e => ({...e.Shipment,TotalRecievedPieces:e.Shipment.TotalRecievedPieces.Value})));
			else
				addWarn("Please, Add Atleast One Item");
		}
	}
	createAShipment = (Id: number): IRowValue => {
		return {
			Shipment: { Id: Id, CaretSize: 0, FlavourId: -1, ProductId: -1, TotalDefectedPieces: 0, TotalRecievedPieces: {Value:0} },
			Observer: this.componentListMediator.GetAObserver(this.state.SubscriptionId, Id), Id: Id + ''
		};
	}
	filterRowNodes = <U, _>(callback: (e: ShipmentGridRowNode) => U): U[] => {
		const shipments: U[] = [];
		this.state.GridOptions.api?.forEachNode(e => (shipments.push(callback(e))));
		return shipments;
	}

	private OnGridReady = (params: GridReadyEvent) => {
		this.setState((prevState) => ({ GridOptions: { ...prevState.GridOptions, api: params.api, columnApi: params.columnApi } }));
	}

	addAShipment = () => {
		const { Products, GridOptions: { api } } = this.state;
		const componentId = getARandomNumber(this.filterRowNodes((e => e.data.Shipment)));
		if (Products.size !== 0) {
			const currentRowCount = api?.getDisplayedRowCount();
			const rowTransations: ShipmentGridDataTransation = {
				add: [this.createAShipment(componentId)]
			};
			this.state.GridOptions.api?.applyTransaction(rowTransations);
			if (currentRowCount) {
				this.refreshRowNodeByIndex(currentRowCount - 1);
			}
			this.setFocusToCell(currentRowCount!, this.getColummnIndex('ProductId')!);
		}
		else
			addDanger("Product Not Available");
	};
	private setFocusToCell = (rowIndex: number, columnIndex: number) => {
		const { GridOptions: { api, columnApi } } = this.state;
		const column = columnApi?.getAllDisplayedColumns()![columnIndex];
		api?.setFocusedCell(rowIndex, column!);
	}
	private refreshRowNodeByIndex = (index: number) => {
		if (index < 0) {
			return;
		}
		const { GridOptions: { api } } = this.state;
		api?.refreshCells({ rowNodes: [api?.getDisplayedRowAtIndex(index)!], force: true });
	}
	handleRemove = (Id: string) => {
		const { GridOptions } = this.state;
		const GridTransaction: ShipmentGridDataTransation = {
			remove: [{ Id }]
		};
		const curentRowIndex = GridOptions.api?.getRowNode(Id)?.rowIndex;
		GridOptions.api?.applyTransaction(GridTransaction);
		if (curentRowIndex) {
			curentRowIndex === ((GridOptions.api?.getDisplayedRowCount()!)) && this.refreshRowNodeByIndex(curentRowIndex - 1);
			this.setFocusToCell(curentRowIndex - 1, this.getColummnIndex('Id')!);
		}
	}
	render() {
		const { ShipmentInfos, GridOptions } = this.state;

		return (<div className="ag-theme-alpine" style={{ height: '500px', width: '100vw' }}>
			<AgGridReact modules={AllCommunityModules} singleClickEdit={true} gridOptions={GridOptions}
				rowData={ShipmentInfos} onGridReady={this.OnGridReady} >
			</AgGridReact>
			<Action handleAdd={this.addAShipment} handleProcess={this.handleSubmit} />
		</div>);
	}
}
