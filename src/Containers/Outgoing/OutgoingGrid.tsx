import React from "react";
import { RouteComponentProps } from "react-router";
import { AgGridReact } from '@ag-grid-community/react';
import { ColDef, ColGroupDef, GridOptions, GridReadyEvent } from '@ag-grid-community/all-modules';
import {
    ValueGetterParams, ValueSetterParams, EditableCallbackParams, CellRendererParams, OutgoingUpdateRow,
    CellEditorParams, CellValueChangedEvent, GridContext, OutgoingRowDataTransaction, OutgoingGridRowValue, QuantityValueParser,
    CustomPriceRowData, CellClassParams, ToolTipRendererParams, RowNodeData, ValueFormatterParams
} from './OutgoingGrid.d';
import { Element, IOutgoingShipmentAddDetail, IOutgoingShipmentUpdateDetail, OutOfStock, PostOutgoingShipment, Product, ResutModel, ShipmentDTO } from "Types/DTO";
import { CustomPriceRenderer, FlavourCellRenderer, ProductCellRenderer, RowStyleSpecifier } from "./Component/Renderers/Renderers";
import CaretSizeRenderer from "Components/AgGridComponent/Renderer/CaretSizeRenderer";
import { GridSelectEditor } from "Components/AgGridComponent/Editors/SelectWithAriaEditor";
import { getARandomNumber, Parser } from "Utilities/Utilities";
import { CaretSizeEditor, CaretSizeNewValue, CaretSizeValue, CaretSizeValueOldAndNewValue } from "Components/AgGridComponent/Editors/CaretSizeEditor";
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
import { OutgoingStatus, OutgoingStatusErrorCode, OutgoingGridRowCode } from "Enums/Enum";
import SalesmanList from "Components/SalesmanList/SalesmanList";
import { addDanger } from "Utilities/AlertUtility";
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import Action from "Components/Action/Action";
import { DeterminantsNotSetError, UnknownSubscription, UnIdentifyComponentError } from 'Errors/Error';
import ProductService from 'Services/ProductService';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules//dist/styles/ag-theme-alpine.css';
import { Heading } from "Components/Miscellaneous/Miscellaneous";
import { AxiosError } from "axios";
interface OutgoingGridProps extends RouteComponentProps<{ id?: string }> {
}

type OutgoingData = {
    Id: number;
    DateCreated: string;
    Status?: OutgoingStatus;
    SalesmanId: number;
    Shipments: OutgoingGridRowValue[];
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
const QuantityCellRederer = CaretSizeRenderer<CellRendererParams<number>>(e => e.data.Shipment.CaretSize, e => e.value);
const ReInitializeCustomPrice = function (customPrices: CustomPriceRowData[], quantity: number) {
    const quantityMediator = new QuantityMediatorWrapper(quantity);
    for (let i = 0; i < customPrices.length; i++) {
        if (customPrices[i].Quantity.Value.Value > quantityMediator.GetQuantityLimit()) {
            for (let j = i; j < customPrices.length; j++) {
                customPrices[j].Quantity.IsValid = false;
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
            const { data: { Observer, Shipment }, api } = params;
            Observer.SetProduct(params.newValue);
            const { FlavourId, Quantity } = Observer.GetObserverInfo();
            Shipment.CaretSize = params.context.getProductDetails(params.newValue).CaretSize;
            Shipment.FlavourId = FlavourId || -1;
            if (!Quantity) {
                Shipment.TotalQuantityTaken = 0;
            }
            api?.refreshCells({ rowNodes: [params.node] });
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
                Shipment.TotalQuantityTaken = 0;
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
            return params.data.Shipment.TotalQuantityTaken;
        },
        editable: function (params: EditableCallbackParams) {
            return params.data.Shipment.ProductId !== -1 && params.data.Shipment.FlavourId !== -1;
        },
        valueSetter: function (params: CaretSizeValueOldAndNewValue<ValueSetterParams<OutgoingUpdateRow['TotalQuantityTaken']>>) {
            params.data.Shipment.TotalQuantityTaken = params.newValue.IsValid ? params.newValue.Value : params.oldValue;
            return true;
        },
        onCellValueChanged: function (params: CellValueChangedEvent<number>) {
            const { context, data: { Observer } } = params;
            Observer.SetQuantity(params.newValue);

            if (context.IsOnUpdate) {
                params.data.Shipment.TotalQuantityShiped = params.newValue - params.data.Shipment.TotalQuantityReturned;
            }
        },
        tooltipValueGetter: ToolTipValueGetter('TotalQuantityTaken'),
        cellClassRules: ClassSpecifier('TotalQuantityTaken'),
        cellRendererFramework: QuantityCellRederer,
        cellEditorFramework: CaretSizeEditor<CellEditorParams<OutgoingUpdateRow['TotalQuantityTaken']>>(e => e.data.Shipment.CaretSize, (e) => e.data.Shipment.ProductId !== -1, (e) => {
            const { data: { Observer } } = e;
            let maxLimit = 0;
            try {
                Observer.UnsubscribeIfSubscribedToQuantity();
                maxLimit = Observer.GetQuantityLimit();
            }
            catch (e) {
                if (e instanceof DeterminantsNotSetError) {

                }
                else throw e;
            }
            return maxLimit;
        }, (e) => {
            const { context: { IsOnUpdate }, data } = e;
            let minLimit;
            if (IsOnUpdate)
                minLimit = data.Shipment.TotalQuantityReturned;
            return minLimit;
        })
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
            return params.data.Shipment.TotalQuantityTaken > 0;
        },
        cellRendererFramework: QuantityCellRederer,
        onCellValueChanged: function (params: CellValueChangedEvent<OutgoingUpdateRow['TotalQuantityReturned']>) {
            params.data.Shipment.TotalQuantityShiped = params.data.Shipment.TotalQuantityTaken - params.newValue;
        },
        cellClassRules: ClassSpecifier('TotalQuantityReturned'),
        tooltipValueGetter: ToolTipValueGetter('TotalQuantityReturned'),
        cellEditorFramework: CaretSizeEditor<CellEditorParams<OutgoingUpdateRow['TotalQuantityReturned']>>(
            (e) => e.data.Shipment.CaretSize, (e) => e.data.Shipment.TotalQuantityShiped > 0,
            (e) => e.data.Shipment.TotalQuantityTaken
        )
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
        this.products = [];
        this.productService = new ProductService();
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
                defaultColDef,
                getRowStyle: RowStyleSpecifier
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
                TotalQuantityRejected: 0, TotalQuantityReturned: 0, TotalQuantityShiped: 0, TotalQuantityTaken: 0,
                TotalSchemeQuantity: 0, Status: OutgoingGridRowCode.NONE
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
        try {
            this.mediatorSubject.UnsubscribeAComponent(1, Number.parseInt(Id));

        }
        catch (error) {
            if (error instanceof UnknownSubscription || error instanceof UnIdentifyComponentError) {

            }
            else
                throw error;
        }
        const transaction: OutgoingRowDataTransaction = {
            remove: [{ Id }]
        }
        api?.applyTransaction(transaction);
    }
    getAllRows = () => {
        const { GridOptions: { api } } = this.state;
        const results: OutgoingGridRowValue[] = [];
        api?.forEachNode((node) => {
            results.push(node.data);
        });
        return results;
    }
    handleSalesmanSelect = (Id: number) => {
        this.setState((prevState) => { return { OutgoingData: { ...prevState.OutgoingData, SalesmanId: Id } } });
    }
    handleSubmit = () => {
        const { IsOnUpdate, OutgoingData } = this.state;

        if (document.getElementsByClassName('is-invalid').length > 0) {
            alert('Please Fill Properly');
            return;
        }
        if (!IsOnUpdate) {
            const rows = this.getAllRows();
            const data: PostOutgoingShipment = {
                DateCreated: new Date(OutgoingData.DateCreated),
                SalesmanId: OutgoingData.SalesmanId,
                Shipments: rows.map(e => ({ Id: e.Shipment.Id, CaretSize: e.Shipment.CaretSize, FlavourId: e.Shipment.FlavourId, ProductId: e.Shipment.ProductId, TotalDefectedPieces: e.Shipment.TotalQuantityRejected, TotalRecievedPieces: e.Shipment.TotalQuantityTaken } as ShipmentDTO))
            }
            this.outgoingService.Add(data)
                .catch(e => this.handleError(e));
        }
        else {
            alert('Valid');
        }
    }

    render() {
        const { IsOnUpdate, GridOptions, ApiInfo: { Status, Message }, OutgoingData } = this.state;
        return (
            <div>
                {IsOnUpdate ? <Heading label="Update Outgoing Shipment" /> : <Heading label="Add Outgoing Shipment" />}
                <Loader Message={Message} Status={Status}>
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
                </Loader>
            </div>);
    }
    handleError = (error: AxiosError) => {
        if (error.response?.status === 422) {
            const { GridOptions: { api } } = this.state;
            const dataArray = [] as RowNodeData[];
            api?.forEachNode((node) => dataArray.push(node.data));
            const model = (error.response.data as ResutModel);
            const content = model.Content as Element[];
            switch (model.Code) {
                case OutgoingStatusErrorCode.CUSTOM_CARAT_PRICE_NOT_VALID:
                    alert('Custom Carat Price Not Valid.\nPlease, Contact Administration');
                    break;
                case OutgoingStatusErrorCode.DUPLICATE:
                    alert('Duplicate Product Element Exists.\nPlease, Contact Administration');
                    break;
                case OutgoingStatusErrorCode.OUT_OF_STOCK:
                    const outOfStockProducts = content as OutOfStock[];
                    dataArray.forEach(data => {
                        const p = outOfStockProducts.find(e => e.FlavourId == data.FlavourId && e.ProductId == data.ProductId);
                        if (p) {
                            data.Status = OutgoingGridRowCode.OUT_OF_STOCK;
                        }
                    });
                    api?.refreshCells();
                    break;
                case OutgoingStatusErrorCode.SCHEME_PRICE_NOT_VALID:
                    alert('Scheme Price Calculation Not Valid.\nPlease, Contact Administration');
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
        else {
            addDanger('Error Sending Data');
        }
    }

    private setMediator(products: Product[]) {
        this.products = products;
        this.mediatorSubject = new MediatorSubject(products);
    }
    componentDidMount() {
        const { match: { params: { id } } } = this.props;
        const { IsOnUpdate } = this.state;

        if (IsOnUpdate) {
            if (id && Number.parseInt(id)) {
                this.setState({ ApiInfo: { Status: CallStatus.LOADING, Message: "Gathering Shipment Info . . ." } });
                this.outgoingService.GetById(Number.parseInt(id))
                    .then(res => {
                        this.setState({
                            ApiInfo: { Status: CallStatus.LOADING, Message: "Gathering Product List . . ." }
                        });
                        return this.productService.GetAll(res.data.DateCreated).then(res2 => {
                            const products: Product[] = res2.data;
                            res.data.OutgoingShipmentDetails.forEach(details =>
                                products.find(e => e.Id === details.ProductId)!.Flavours.find(e => e.Id === details.FlavourId)!.Quantity += details.TotalQuantityShiped);
                            this.setMediator(products);
                            const rowData: OutgoingGridRowValue[] = [];
                            res.data.OutgoingShipmentDetails.forEach(element => {
                                const observer = this.mediatorSubject.GetAObserver(1, element.Id);
                                observer.SetProduct(element.ProductId)
                                observer.SetFlavour(element.FlavourId);
                                //quantity are not added to mediator if return value not null
                                observer.SetQuantity(element.TotalQuantityTaken);
                                rowData.push({
                                    Id: element.Id + '',
                                    Observer: observer,
                                    Shipment: { ...element, Status: OutgoingGridRowCode.NONE }
                                })
                            });
                            this.setState({ ApiInfo: { Status: CallStatus.LOADED, Message: undefined } });
                        })
                    })
                    .catch(() => this.setState({ ApiInfo: { Status: CallStatus.ERROR, Message: "Error Loading Shipment Info" } }));
            }
            else {
                alert('Outgoing Id Cannot Be A Non-Integer');
            }
        }
        else {

            this.productService.GetAll()
                .then(res => this.setMediator(res.data));

        }
    }
}