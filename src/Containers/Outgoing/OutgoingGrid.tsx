import React from "react";
import { RouteComponentProps } from "react-router";
import { AgGridReact } from '@ag-grid-community/react';
import { ColDef, ColGroupDef, GridOptions, GridReadyEvent } from '@ag-grid-community/all-modules';
import {
    ValueGetterParams, ValueSetterParams, EditableCallbackParams, CellRendererParams, OutgoingUpdateRow,
    CellEditorParams, CellValueChangedEvent, GridContext, OutgoingRowDataTransaction, OutgoingGridRowValue, QuantityValueParser,
    CellClassParams, ToolTipRendererParams, RowNodeData, ValueFormatterParams, OutgoingGridColName, OutgoingGridCol
} from './OutgoingGrid.d';
import { CustomPrice, Element, IOutgoingShipmentAddDetail, IOutgoingShipmentUpdateDetail, OutOfStock, PostOutgoingShipment, Product, ResutModel, SchemeInfo, ShipmentDTO } from "Types/DTO";
import { CustomPriceRenderer, FlavourCellRenderer, ProductCellRenderer, RowStyleSpecifier } from "./Component/Renderers/Renderers";
import CaretSizeRenderer from "Components/AgGridComponent/Renderer/CaretSizeRenderer";
import { GridSelectEditor } from "Components/AgGridComponent/Editors/SelectWithAriaEditor";
import { getARandomNumber, KeyCode, Parser, UniqueValueProvider } from "Utilities/Utilities";
import { CaretSizeEditor, CaretSizeNewValue, CaretSizeValueOldAndNewValue } from "Components/AgGridComponent/Editors/CaretSizeEditor";
import ActionCellRenderer, { ActionCellParams } from 'Components/AgGridComponent/Renderer/ActionCellRender';
import CustomPriceEditor from "./Component/Editors/CustomPriceEditor";
import CellClassRuleSpecifier from "Components/AgGridComponent/StyleSpeficier/ShipmentCellStyle";
import OutgoingValidator from 'Validation/OutgoingValidation';
import QuantityMediatorWrapper from '../../Utilities/QuatityMediatorWrapper';
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
import { AllCommunityModules, SuppressKeyboardEventParams } from '@ag-grid-community/all-modules';
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
    tooltipComponentFramework: ToolTipComponent,

}

const ClassSpecifier = (name: OutgoingGridColName) => CellClassRuleSpecifier<OutgoingUpdateRow, OutgoingValidator, OutgoingGridCol>(name, OutgoingValidator, (params: CellClassParams) => params.data.Shipment);

const ToolTipValueGetter = (name: OutgoingGridColName) => ToolTipGetter(OutgoingValidator, name, (e: ToolTipRendererParams) => e.data.Shipment);
const QuantityCellRederer = CaretSizeRenderer<CellRendererParams<number>>(e => e.data.Shipment.CaretSize);
const ReInitializeCustomPrice = function (customPrices: CustomPrice[], quantity: number) {
    const quantityMediator = new QuantityMediatorWrapper(quantity);
    for (let i = 0; i < customPrices.length; i++) {
        if (customPrices[i].Quantity > quantityMediator.GetQuantityLimit()) {
            for (let j = i; j < customPrices.length; j++) {
                customPrices[j].Quantity = 0;
            }
            break;
        }
        else
            quantityMediator.Subscribe(customPrices[i].Id, customPrices[i].Quantity);
    }
    return customPrices;
}

const getColumnId = function (name: OutgoingGridColName) {
    let columnIndex: number | null = null;
    switch (name) {
        case 'ProductId':
            columnIndex = 1; break;
        case 'FlavourId':
            columnIndex = 2; break;
        case 'CaretSize':
            columnIndex = 3; break;
        case 'TotalQuantityTaken':
            columnIndex = 4; break;
        case 'TotalQuantityReturned':
            columnIndex = 5; break;
        case 'TotalQuantityShiped':
            columnIndex = 6; break;
        case 'TotalSchemeQuantity':
            columnIndex = 7; break;
        case 'CustomCaratPrices':
            columnIndex = 8; break;
        case 'Id':
            columnIndex = 9; break;
        case 'TotalSchemePrice':
            columnIndex = 10; break;
            break;
    }
    return columnIndex + '';
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
        tooltipValueGetter: ToolTipValueGetter('ProductId'),
        colId: getColumnId('ProductId')
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
                params.node.setDataValue(params.context.getColumnId('TotalQuantityTaken'),{IsValid:true,Value:0} as CaretSizeNewValue);
            }

        },
        cellEditorFramework: GridSelectEditor<OutgoingGridRowValue, any>((e) => e.Observer.GetFlavours().map(e => ({ label: e.Title, value: e.Id })), (e) => e.Shipment.ProductId !== -1),
        editable: (params: EditableCallbackParams) => params.data.Shipment.ProductId != -1,
        colId: getColumnId('FlavourId')
    },
    {
        headerName: 'Caret Size',
        valueGetter: function (params: ValueGetterParams) {
            return params.data.Shipment.CaretSize;
        },
        editable: false,
        cellClassRules: ClassSpecifier('CaretSize'),
        colId: getColumnId('CaretSize')
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
            const { context, data: { Observer }, node } = params;
            Observer.SetQuantity(params.newValue);

            if (context.IsOnUpdate) {
                node.setDataValue(context.getColumnId('TotalQuantityShiped'), params.newValue - params.data.Shipment.TotalQuantityReturned);
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
        }),
        colId: getColumnId('TotalQuantityTaken')
    }
];
const updateColDefs: (ColDef | ColGroupDef)[] = [
    {
        headerName: 'Return',
        valueGetter: (params: ValueGetterParams) => params.data.Shipment.TotalQuantityReturned,
        valueSetter: (params: CaretSizeValueOldAndNewValue<ValueSetterParams<OutgoingUpdateRow['TotalQuantityReturned']>>) => {
            params.data.Shipment.TotalQuantityReturned = params.newValue.IsValid ? params.newValue.Value : params.oldValue;
            return true;
        },
        editable: (params: EditableCallbackParams) => {
            return params.data.Shipment.TotalQuantityTaken > 0;
        },
        cellRendererFramework: QuantityCellRederer,
        onCellValueChanged: function (params: CellValueChangedEvent<OutgoingUpdateRow['TotalQuantityReturned']>) {
            params.node.setDataValue(params.context.getColumnId('TotalQuantityShiped'), params.data.Shipment.TotalQuantityTaken - params.newValue)
        },
        cellClassRules: ClassSpecifier('TotalQuantityReturned'),
        tooltipValueGetter: ToolTipValueGetter('TotalQuantityReturned'),
        cellEditorFramework: CaretSizeEditor<CellEditorParams<OutgoingUpdateRow['TotalQuantityReturned']>>(
            (e) => e.data.Shipment.CaretSize, (e) => e.data.Shipment.TotalQuantityTaken > 0,
            (e) => e.data.Shipment.TotalQuantityTaken
        ),
        colId: getColumnId('TotalQuantityReturned')
    },
    {
        headerName: 'Sale',
        valueGetter: (params: ValueGetterParams) => {
            return params.data.Shipment.TotalQuantityShiped;
        },
        valueSetter: function (params: ValueSetterParams<number>) {
            params.data.Shipment.TotalQuantityShiped = params.newValue;
            return true;
        },
        editable: false,
        onCellValueChanged: function (params: CellValueChangedEvent<OutgoingUpdateRow['TotalQuantityShiped']>) {
            const { node, context: { getColumnId } } = params;
            const customPrices = params.data.Shipment.CustomCaratPrices;

            node.setDataValue(getColumnId('CustomCaratPrices'), ReInitializeCustomPrice(customPrices, params.newValue));
            const schemeQuantity = params.context.getProductDetails(params.data.Shipment.ProductId).SchemeQuantity;

            // set corresponding SchemePrice and TotalSchemeQuantity
            //node.setDataValue(getColumnId('TotalSchemePrice'), totalPrice);
            node.setDataValue(getColumnId('TotalSchemeQuantity'), schemeQuantity);
        },
        cellClassRules: ClassSpecifier('TotalQuantityShiped'),
        tooltipValueGetter: ToolTipValueGetter('TotalQuantityShiped'),
        colId: getColumnId('TotalQuantityShiped'),
        cellRendererFramework: QuantityCellRederer
    },
    {
        headerName: 'Scheme',
        children: [
            {
                headerName: 'Quantity',
                valueGetter: (params: ValueGetterParams) => params.data.Shipment.SchemeInfo.TotalQuantity,
                tooltipValueGetter: ToolTipValueGetter('TotalSchemeQuantity'),
                colId: getColumnId('TotalSchemeQuantity'),
                valueSetter: function (params: ValueSetterParams<OutgoingUpdateRow['SchemeInfo']['SchemeQuantity']>) {
                    if (!Number.isInteger(params.newValue))
                        return false;
                    const totalCaret = Math.floor(params.data.Shipment.TotalQuantityShiped / params.data.Shipment.CaretSize);
                    params.data.Shipment.SchemeInfo.TotalQuantity = params.newValue * totalCaret;
                    params.data.Shipment.SchemeInfo.SchemeQuantity = params.newValue;
                    return true;
                },
                onCellValueChanged(params: CellValueChangedEvent<number>) {
                    const schemeProduct = params.context.getProductDetails(config.SchemeProductId);
                    const totalBottle = params.newValue;
                    params.node.setDataValue(params.context.getColumnId('TotalSchemePrice'), schemeProduct.PricePerBottle * totalBottle);
                }
            },
            {
                headerName: 'Price',
                tooltipValueGetter: ToolTipValueGetter('TotalSchemePrice'),
                valueGetter: (params: ValueGetterParams) => params.data.Shipment.SchemeInfo.TotalSchemePrice,
                colId: getColumnId('TotalSchemePrice'),
                valueSetter: function (params: ValueSetterParams<OutgoingUpdateRow['SchemeInfo']['TotalSchemePrice']>) {
                    params.data.Shipment.SchemeInfo.TotalSchemePrice = params.newValue;
                    return true;
                }
            }
        ],
        marryChildren: true
    },
    {
        headerName: 'Custom Price',
        valueGetter: (params: ValueGetterParams) => params.data.Shipment.CustomCaratPrices,
        valueSetter: (params: ValueSetterParams<OutgoingUpdateRow['CustomCaratPrices']>) => {
            params.data.Shipment.CustomCaratPrices = params.newValue;
            return true;
        },
        tooltipValueGetter: ToolTipValueGetter('CustomCaratPrices'),
        cellRendererFramework: CustomPriceRenderer,
        cellEditorFramework: CustomPriceEditor,
        cellClassRules: ClassSpecifier('CustomCaratPrices'),
        colId: getColumnId('CustomCaratPrices'),
        suppressKeyboardEvent: function (params: SuppressKeyboardEventParams) {
            if (params.editing && params.event.keyCode === KeyCode.ENTER) {
                return !params.event.altKey;
            }
            return false;
        },
        autoHeight: true, wrapText: true
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
export default class OutgoingGrid extends React.Component<OutgoingGridProps, OutgoingGridState>{
    private mediatorSubject: MediatorSubject;
    private products: Product[];
    private outgoingService: IOutgoingShipmentService;
    private productService: IProductService;
    private uniqueValueProvider = new UniqueValueProvider();
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
                    getColumnId: getColumnId,
                    getProductDetails: (Id: number) => this.products.find(e => e.Id === Id)!,
                    IsOnUpdate
                } as GridContext,
                getRowNodeId: (data: OutgoingGridRowValue) => data.Id,
                defaultColDef,
                getRowStyle: RowStyleSpecifier,
                tooltipShowDelay: 0
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
                CaretSize: 0, CustomCaratPrices: [], FlavourId: -1, Id: componentId, ProductId: -1, SchemeInfo: { SchemeQuantity: 0, TotalQuantity: 0, TotalSchemePrice: 0 },
                TotalQuantityRejected: 0, TotalQuantityReturned: 0, TotalQuantityShiped: 0, TotalQuantityTaken: 0, Status: OutgoingGridRowCode.NONE
            }
        }
    }
    addAShipment = () => {
        const { GridOptions: { api } } = this.state;
        const componentId = this.uniqueValueProvider.GetUniqueValue() as number;
        const transaction: OutgoingRowDataTransaction = {
            add: [this.createAShipment(componentId)]
        }
        api?.applyTransaction(transaction);
    }
    deleteAShipment = (Id: string) => {
        const { GridOptions: { api } } = this.state;
        try {
            this.mediatorSubject.UnsubscribeAComponent(1, (api!.getRowNode(Id)!.data as OutgoingGridRowValue).Shipment.Id);
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
                .then(() => this.props.history.push({ pathname: "/message/pass", search: "?message=Added SuccessFully" }))
                .catch(e => this.handleError(e));
        }
        else {
            const details = this.getAllRows().map(e => e.Shipment);
            const outgoingData = this.state.OutgoingData;
            this.outgoingService
                .UpdateOutgoingShipment({ DateCreated: new Date().toISOString(), SalesmanId: outgoingData.SalesmanId, Id: outgoingData.Id, OutgoingShipmentDetails: details })
                .then(() => this.props.history.push({ pathname: "/message/pass", search: "?message=Updated SuccessFully" }), (e) => this.handleError(e))
        }
    }

    render() {
        const { IsOnUpdate, GridOptions, ApiInfo: { Status, Message }, OutgoingData } = this.state;
        return (
            <div>
                {IsOnUpdate ? <Heading label="Update Outgoing Shipment" /> : <Heading label="Add Outgoing Shipment" />}
                <div className="form-inline">
                    <SalesmanList handleSelection={this.handleSalesmanSelect} SalemanId={OutgoingData.SalesmanId} />
                    {
                        OutgoingData.Status !== undefined && <div className="input-group mb-2 mr-sm-2">
                            <div className="input-group-prepend">
                                <div className="input-group-text">Shipment Status</div>
                            </div>
                            <input type="text" className="form-control" value={Object.entries(OutgoingStatus).find((k, v) => v == OutgoingData.Status)![1]} />
                        </div>
                    }
                </div>
                <Loader Message={Message} Status={Status}>

                    <div className="ag-theme-alpine" style={{ height: '500px', width: '100vw' }}>

                        <AgGridReact gridOptions={GridOptions} rowData={OutgoingData.Shipments} modules={AllCommunityModules}
                            onGridReady={this.OnGridReady} ></AgGridReact>
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
                                this.uniqueValueProvider.Add(element.Id);
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
                            this.setState({ ApiInfo: { Status: CallStatus.LOADED, Message: undefined }, OutgoingData: { ...res.data, SalesmanId: res.data.Salesman.Id, Shipments: rowData } });
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
                .then(res => this.setMediator(res.data))
                .catch(e => this.setState({ ApiInfo: { Status: CallStatus.ERROR, Message: "Error Fetching Product" } }));
        }
    }
}