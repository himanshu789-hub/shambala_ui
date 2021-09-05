import React from "react";
import { RouteComponentProps } from "react-router";
import { AgGridReact } from '@ag-grid-community/react';
import { ColDef, ColGroupDef, GridOptions, GridReadyEvent } from '@ag-grid-community/all-modules';
import {
    ValueGetterParams, ValueSetterParams, EditableCallbackParams, CellRendererParams, OutgoingUpdateRow,
    CellEditorParams, CellValueChangedEvent, GridContext, OutgoingRowDataTransaction, OutgoingGridRowValue, QuantityValueParser,
    CustomPriceRowData, CellClassParams, ToolTipRendererParams, RowNodeData
} from './OutgoingGrid.d';
import { Element, IOutgoingShipmentAddDetail, IOutgoingShipmentUpdateDetail, OutOfStock, Product, ResutModel } from "Types/DTO";
import { CustomPriceRenderer, FlavourCellRenderer, ProductCellRenderer } from "./Component/Renderers/Renderers";
import CaretSizeRenderer from "Components/AgGridComponent/Renderer/CaretSizeRenderer";
import { GridSelectEditor } from "Components/AgGridComponent/Editors/SelectWithAriaEditor";
import { getARandomNumber, Parser } from "Utilities/Utilities";
import { CaretSizeEditor, CaretSizeValue } from "Components/AgGridComponent/Editors/CaretSizeEditor";
import ActionCellRenderer, { ActionCellParams } from 'Components/AgGridComponent/Renderer/ActionCellRender';
import CustomPriceEditor from "./Component/Editors/CustomPriceEditor";
import CellClassRuleSpecifier from "Components/AgGridComponent/StyleSpeficier/ShipmentCellStyle";
import OutgoingValidator from 'Validation/OutgoingValidation';
import QuantityMediatorWrapper from './Component/Editors/QuatityMediatorWrapper';
import MediatorSubject from 'Utilities/MediatorSubject';
import config from 'config.json';
import IProductService from 'Contracts/services/IProductService';
import { ToolTipComponent, ToolTipGetter } from "Components/AgGridComponent/Renderer/ToolTipRenderer";
import OutgoingShipmentService from 'Services/OutgoingShipmentService';
import IOutgoingShipmentService from 'Contracts/services/IOutgoingShipmentService';
import Loader, { ApiStatusInfo, CallStatus } from "Components/Loader/Loader";
import { OutgoingStatus, OutgoingStatusErrorCode } from "Enums/Enum";
import SalesmanList from "Components/SalesmanList/SalesmanList";
import { addDanger } from "Utilities/AlertUtility";
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import Action from "Components/Action/Action";
import { DeterminantsNotSetError } from 'Errors/Error';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules//dist/styles/ag-theme-alpine.css';

interface OutgoingGridProps extends RouteComponentProps<{ id?: string }> {
}

type OutgoingData = {
    Id: number;
    DateCreated: string;
    Status?: OutgoingStatus;
    SalesmanId: number;
    Shipments: IOutgoingShipmentUpdateDetail[];
}
type OutgoingGridState = {
    GridOptions: GridOptions;
    ApiInfo: ApiStatusInfo;
    IsOnUpdate: boolean;
    OutgoingData: OutgoingData;
}
const defaultColDef: ColDef = {
    flex: 1,
    editable: true,
    tooltipComponentFramework: ToolTipComponent
}
const ClassSpecifier = (name: keyof OutgoingUpdateRow) => CellClassRuleSpecifier<OutgoingUpdateRow, OutgoingValidator>(name, OutgoingValidator, (params: CellClassParams) => params.data.Shipment);
//@ts-ignore
const ToolTipValueGetter = (name: keyof OutgoingUpdateRow) => ToolTipGetter(OutgoingValidator, name, (e: ToolTipRendererParams) => e.data.Shipment);
const QuantityCellRederer = CaretSizeRenderer<CellRendererParams<CaretSizeValue>>(e => e.data.Shipment.CaretSize, e => e.value.Value);
const ReInitializeCustomPrice = function (customPrices: CustomPriceRowData[], quantity: number) {
    const quantityMediator = new QuantityMediatorWrapper(quantity);
    for (let i = 0; i < customPrices.length; i++) {
        if (customPrices[i].Quantity.Value.Value > quantityMediator.GetQuantityLimit()) {
            for (let j = i; j < customPrices.length; j++) {
                customPrices[j].Quantity.IsValid = false;
                customPrices[j].Quantity.Value.MaxLimit = 0;
            }
            break;
        }
        else {
            const limit = quantityMediator.GetQuantityLimit();
            quantityMediator.Subscribe(i, customPrices[i].Quantity.Value.Value);
            customPrices[i].Quantity.Value.MaxLimit = limit;
        }
    }
    return customPrices;
}
const commonColDefs: ColDef[] = [
    {
        headerName: 'Product Name',
        valueGetter: function (params: ValueGetterParams) {
            return params.data.Shipment.ProductId;
        },
        valueSetter: function (params: ValueSetterParams<IOutgoingShipmentAddDetail['ProductId']>) {
            params.data.Shipment.ProductId = params.newValue;
            return true;
        },
        cellClassRules: ClassSpecifier('ProductId'),
        cellRendererFramework: ProductCellRenderer,
        cellEditorFramework: GridSelectEditor<OutgoingGridRowValue, any>(e => Parser.ProductsToValueContainer(e.Observer.GetProducts())),
        onCellValueChanged: function (params: CellValueChangedEvent<OutgoingUpdateRow['ProductId']>) {
            const { data: { Observer, Shipment } } = params;
            Observer.SetProduct(params.newValue);
            const { FlavourId, Quantity } = Observer.GetObserverInfo();
            Shipment.CaretSize = params.context.getProductDetails(params.newValue).CaretSize;
            Shipment.FlavourId = FlavourId || -1;
            if (!Quantity) {
                Shipment.TotalQuantityTaken = { Value: 0 };
            }
        },
        tooltipValueGetter: ToolTipValueGetter('ProductId')
    },
    {
        headerName: 'Flavour Name',
        valueGetter: function (params: ValueGetterParams) {
            return params.data.Shipment.FlavourId;
        },
        valueSetter: function (params: ValueSetterParams<IOutgoingShipmentAddDetail['FlavourId']>) {
            params.data.Shipment.FlavourId = params.newValue;
            return true;
        },
        tooltipValueGetter: ToolTipValueGetter('FlavourId'),
        cellClassRules: ClassSpecifier('FlavourId'),
        cellRendererFramework: FlavourCellRenderer,
        onCellValueChanged: function (params: CellValueChangedEvent<OutgoingUpdateRow['FlavourId']>) {
            const { data: { Observer, Shipment } } = params;
            Observer.SetFlavour(params.newValue);
            const { Quantity } = Observer.GetObserverInfo();
            if (!Quantity) {
                Shipment.TotalQuantityTaken = { Value: 0 }
            }
        },
        cellEditorFramework: GridSelectEditor<OutgoingGridRowValue, any>((e) => e.Observer.GetFlavours().map(e => ({ label: e.Title, value: e.Id })), (e) => e.Shipment.ProductId !== -1),
        editable: (params: EditableCallbackParams) => params.data.Shipment.ProductId != -1
    },
    {
        headerName: 'Caret Size',
        valueGetter: function (params: ValueGetterParams) {
            return params.data.Shipment.CaretSize;
        },
        editable: false,
        cellClassRules: ClassSpecifier('CaretSize')
    },
    {
        headerName: 'Taken',
        valueGetter: function (params: ValueGetterParams) {
            const { data: { Observer } } = params;
            let maxLimit;
            try {
                Observer.UnsubscribeIfSubscribedToQuantity();
                maxLimit = Observer.GetQuantityLimit();
            }
            catch (e) {
                if (e instanceof DeterminantsNotSetError) {

                }
                else
                    throw e;
            }
            return { ...params.data.Shipment.TotalQuantityTaken, MaxLimit: maxLimit } as CaretSizeValue;
        },
        valueSetter: function (params: ValueSetterParams<OutgoingUpdateRow['TotalQuantityShiped']>) {
            params.data.Shipment.TotalQuantityTaken = params.data.Shipment.TotalQuantityTaken;
            return true;
        },
        onCellValueChanged: function (params: CellValueChangedEvent<OutgoingUpdateRow['TotalQuantityTaken']>) {
            const { context } = params;
            const { Observer } = params.data;
            Observer.SetQuantity(params.newValue.Value);
            if (context.IsOnUpdate) {
                params.data.Shipment.TotalQuantityShiped = params.newValue.Value - params.data.Shipment.TotalQuantityReturned.Value;
                params.data.Shipment.TotalQuantityReturned = { ...params.data.Shipment.TotalQuantityReturned, MaxLimit: params.data.Shipment.TotalQuantityTaken.Value };
            }
        },
        valueParser: function (params: QuantityValueParser) {
            const { newValue: { Value, IsValid } } = params;
            return { Value: IsValid ? Value : 0 };
        },
        tooltipValueGetter: ToolTipValueGetter('TotalQuantityTaken'),
        cellClassRules: ClassSpecifier('TotalQuantityTaken'),
        cellRendererFramework: QuantityCellRederer,
        cellEditorFramework: CaretSizeEditor<CellEditorParams<OutgoingUpdateRow['TotalQuantityTaken']>>(e => e.data.Shipment.CaretSize, (e) => e.data.Shipment.ProductId !== -1)
    }
];

const updateColDefs: (ColDef | ColGroupDef)[] = [
    {
        headerName: 'Return',
        valueGetter: (params: ValueGetterParams) => params.data.Shipment.TotalQuantityReturned,
        valueSetter: (params: ValueSetterParams<OutgoingUpdateRow['TotalQuantityReturned']>) => {
            params.data.Shipment.TotalQuantityReturned = params.newValue;
            return true;
        },
        editable: (params: EditableCallbackParams) => {
            return params.data.Shipment.TotalQuantityTaken.Value > 0;
        },
        cellRendererFramework: QuantityCellRederer,
        valueParser: function (params: QuantityValueParser) {
            const { newValue: { Value, IsValid } } = params;
            return { Value: IsValid ? Value : 0 } as CaretSizeValue;
        },
        onCellValueChanged: function (params: CellValueChangedEvent<OutgoingUpdateRow['TotalQuantityReturned']>) {
            params.data.Shipment.TotalQuantityShiped = params.data.Shipment.TotalQuantityTaken.Value - params.newValue.Value;
        },
        cellClassRules: ClassSpecifier('TotalQuantityReturned'),
        tooltipValueGetter: ToolTipValueGetter('TotalQuantityReturned'),
        cellEditorFramework: CaretSizeEditor<CellEditorParams<OutgoingUpdateRow['TotalQuantityReturned']>>(e => e.data.Shipment.CaretSize, (e) => e.data.Shipment.TotalQuantityShiped > 0)
    },
    {
        headerName: 'Sale',
        valueGetter: (params: ValueGetterParams) => {
            return params.data.Shipment.TotalQuantityShiped;
        },
        editable: false,
        onCellValueChanged: function (params: CellValueChangedEvent<OutgoingUpdateRow['TotalQuantityShiped']>) {
            const customPrices = params.data.Shipment.CustomPrices;
            params.data.Shipment.CustomPrices = ReInitializeCustomPrice(customPrices, params.newValue);
            const schemeQuantity = params.context.getProductDetails(params.data.Shipment.ProductId).SchemeQuantity;
            if (schemeQuantity) {
                const schemeProduct = params.context.getProductDetails(config.SchemeProductId);
                const totalCaret = Math.floor(params.newValue / params.data.Shipment.CaretSize);
                const totalBottle = schemeQuantity * totalCaret;
                const totalPrice = (schemeProduct.Price / schemeProduct.CaretSize) * totalBottle;
                const { data: { Shipment } } = params;
                Shipment.SchemePrice = totalPrice;
                Shipment.TotalSchemeQuantity = totalBottle;
            }
        },
        cellClassRules: ClassSpecifier('TotalQuantityShiped'),
        tooltipValueGetter: ToolTipValueGetter('TotalQuantityShiped')
    },
    {
        headerName: 'Scheme',
        children: [
            {
                headerName: 'Quantity',
                valueGetter: (params: ValueGetterParams) => params.data.Shipment.TotalSchemeQuantity,
                tooltipValueGetter: ToolTipValueGetter('TotalSchemeQuantity')
            },
            {
                headerName: 'Price',
                tooltipValueGetter: ToolTipValueGetter('SchemePrice'),
                valueGetter: (params: ValueGetterParams) => params.data.Shipment.SchemePrice
            }
        ]
    },
    {
        headerName: 'Custom Price',
        valueGetter: (params: ValueGetterParams) => params.data.Shipment.CustomPrices,
        valueSetter: (params: ValueSetterParams<OutgoingUpdateRow['CustomPrices']>) => {
            params.data.Shipment.CustomPrices = params.newValue;
            return true;
        },
        tooltipValueGetter: ToolTipValueGetter('CustomPrices'),
        cellRendererFramework: CustomPriceRenderer,
        cellEditorFramework: CustomPriceEditor,
        cellClassRules: ClassSpecifier('CustomPrices')
    }
]
const getActionColDef = function (cellParams: ActionCellParams<string>): ColDef {
    return {
        headerName: 'Action',
        editable: false,
        valueGetter: function (params: ValueGetterParams) {
            return params.data.Shipment.Id;
        },
        cellRendererFramework: ActionCellRenderer,
        cellRendererParams: cellParams
    };
}
const getColumnIndex = function (name: keyof OutgoingUpdateRow) {
    let columnIndex: number | null = null;
    switch (name) {
        case 'ProductId':
            columnIndex = 0; break;
        case 'FlavourId':
            columnIndex = 1; break;
        case 'CaretSize':
            columnIndex = 2; break;
        case 'TotalQuantityTaken':
            columnIndex = 3; break;
        case 'TotalQuantityReturned':
            columnIndex = 4; break;
        case 'TotalQuantityShiped':
            columnIndex = 5; break;
        case 'SchemePrice':
            columnIndex = 6; break;
        case 'CustomPrices':
            columnIndex = 7; break;
        case 'Id':
            columnIndex = 8; break;
    }
    return columnIndex;
}
export default class OutgoingGrid extends React.Component<OutgoingGridProps, OutgoingGridState>{
    private mediatorSubject: MediatorSubject;
    private products: Product[];
    private outgoingService: IOutgoingShipmentService;
    private productService: IProductService;
    constructor(props: OutgoingGridProps) {
        super(props);
        const { match: { params: { id } } } = this.props;
        let colDefs: ColDef[];
        const actionColDef = getActionColDef({ addAChild: this.addAShipment, deleteAChild: this.deleteAShipment });
        this.mediatorSubject = new MediatorSubject([]);
        this.outgoingService = new OutgoingShipmentService();
        this.productService = new ProductSe
        this.products = [];

        if (id) {
            colDefs = [...commonColDefs, ...updateColDefs, actionColDef]
        }
        else
            colDefs = [...commonColDefs, actionColDef]
        const IsOnUpdate = id !== undefined;
        this.state = {
            GridOptions: {
                columnDefs: colDefs,
                context: {
                    getColumnIndex,
                    getProductDetails: (Id: number) => this.products.find(e => e.Id === Id)!,
                    IsOnUpdate
                } as GridContext,
                getRowNodeId: (data: OutgoingGridRowValue) => data.Id,
                defaultColDef
            },
            ApiInfo: { Status: CallStatus.LOADED },
            IsOnUpdate,
            OutgoingData: { DateCreated: new Date().toDateString(), SalesmanId: -1, Shipments: [], Id: 0 },

        };
    }

    private OnGridReady = (params: GridReadyEvent) => {
        this.setState((prevState) => ({ GridOptions: { ...prevState.GridOptions, api: params.api, columnApi: params.columnApi } }));
    }
    getProductDetails = (Id: number) => {
        return this.products.find(e => e.Id === Id)!;
    }
    createAShipment = (componentId: number): OutgoingGridRowValue => {
        return {
            Id: componentId + '',
            Observer: this.mediatorSubject.GetAObserver(1, componentId),
            Shipment: {
                CaretSize: 0, CustomPrices: [], FlavourId: -1, Id: componentId, ProductId: -1, SchemePrice: 0,
                TotalQuantityRejected: { Value: 0 }, TotalQuantityReturned: { Value: 0 }, TotalQuantityShiped: 0, TotalQuantityTaken: { Value: 0 },
                TotalSchemeQuantity: 0
            }
        }
    }
    addAShipment = () => {
        const { GridOptions: { api } } = this.state;
        const componentId = getARandomNumber();
        const transaction: OutgoingRowDataTransaction = {
            add: [this.createAShipment(componentId)]
        }
        api?.applyTransaction(transaction);
    }
    deleteAShipment = (Id: string) => {
        const { GridOptions: { api } } = this.state;
        this.mediatorSubject.UnsubscribeAComponent(1, Number.parseInt(Id));
        const transaction: OutgoingRowDataTransaction = {
            remove: [{ Id }]
        }
        api?.applyTransaction(transaction);
    }

    handleSalesmanSelect = (Id: number) => {
        this.setState((prevState) => { return { OutgoingData: { ...prevState.OutgoingData, SalesmanId: Id } } });
    }
    handleSubmit = () => {

    }
    render() {
        const { GridOptions, ApiInfo: { Status, Message }, OutgoingData } = this.state;
        return (<Loader Message={Message} Status={Status}>
            <div className="form-inline">
                <SalesmanList handleSelection={this.handleSalesmanSelect} SalemanId={OutgoingData.SalesmanId} />
                {
                    OutgoingData.Status && <div className="input-group mb-2 mr-sm-2">
                        <div className="input-group-prepend">
                            <div className="input-group-text">Shipment Status</div>
                        </div>
                        <input type="text" className="form-control" value={Object.entries(OutgoingStatus).find((k, v) => v == OutgoingData.Status)![0]} />
                    </div>
                }
            </div>
            <div className="ag-theme-alpine" style={{ height: '500px', width: '100vw' }}>
                <AgGridReact gridOptions={GridOptions} rowData={OutgoingData.Shipments} modules={AllCommunityModules}
                    onGridReady={this.OnGridReady} singleClickEdit={true}></AgGridReact>
                <Action handleAdd={this.addAShipment} handleProcess={this.handleSubmit} />
            </div>
        </Loader>);
    }
    handleError = (model: ResutModel) => {
        const { GridOptions: { api } } = this.state;
        const dataArray = [] as RowNodeData[];
        api?.forEachNode((node) => dataArray.push(node.data));
        const content = model.Content as Element[];

        switch (model.Code) {
            case OutgoingStatusErrorCode.CUSTOM_CARAT_PRICE_NOT_VALID:
                alert('Custom Carat Price Not Valid.\nPlease, Contact Administration');
                break;
            case OutgoingStatusErrorCode.DUPLICATE:
                alert('Duplicate Product Element Exists.\nPlease, Contact Administration');
                break;
            case OutgoingStatusErrorCode.OUT_OF_STOCK:
                const outOfStockProducts = model.Content as OutOfStock[];
                dataArray.forEach(data => {
                    const p = outOfStockProducts.find(e => e.FlavourId == data.FlavourId && e.ProductId == data.ProductId);
                    if (p)
                        data.TotalQuantityTaken.MaxLimit = p.Quantity;
                });
                api?.refreshCells();
                break;
            case OutgoingStatusErrorCode.SCHEME_EXCEED:
                addDanger('Scheme Product Quantity Excceed');
                break;
            case OutgoingStatusErrorCode.SCHEME_QUANTITY_NOT_VALID:
                alert('Scheme Calculation Not Valid.\nPlease, Contact Administration');
                break;
            case OutgoingStatusErrorCode.SHIPED_QUANTITY_NOT_VALID:
                alert('Product Shiped Value Not Valid.\nPlease, Contact Administration');
                break;
        }
    }
    componentDidMount() {
        const { match: { params: { id } } } = this.props;
        const { IsOnUpdate } = this.state;
    
        if (IsOnUpdate) {
            if (id && Number.parseInt(id)) {
                this.setState({ ApiInfo: { Status: CallStatus.LOADING, Message: "Gathering Shipment Info . . ." } });
                this.outgoingService.GetById(Number.parseInt(id))
                    .then(res => this.setState({
                        OutgoingData: {
                            DateCreated: res.data.DateCreated,
                            SalesmanId: res.data.Salesman.Id, Shipments: res.data.OutgoingShipmentDetails,
                            Id: res.data.Id,
                            Status: res.data.Status
                        }
                    }))
                    .catch(() => this.setState({ ApiInfo: { Status: CallStatus.ERROR, Message: "Error Loading Shipment Info" } }));
            }
        }

    }
}