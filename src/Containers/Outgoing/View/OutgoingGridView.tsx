import { AgGridReact } from "@ag-grid-community/react";
import { GridOptions } from '@ag-grid-community/all-modules';
import { RouteComponentProps } from "react-router";
import { getPriceInText, getQuantityInText, IsValidInteger } from "Utilities/Utilities";
import { useEffect, useState } from "react";
import { CustomCaratPrice, IAggregateDetailDTO, IOutgoingShipmentUpdateDetail, OutgoingShipmentView, SchemeInfo } from "Types/DTO";
import Loader, { ApiStatusInfo, CallStatus } from "Components/Loader/Loader";
import { OutgoingStatus } from "Enums/Enum";
import { GridApi, GridReadyEvent, ICellRendererParams } from "@ag-grid-community/core";
import { getColumnName } from "../Helpher";
import { QuantityWithPriceCellRenderer, showQuantityAndPrice } from "../Components/Renderers/Renderers";
import { GridRendererParams, GridValueFormatterParams, GridValueParserParams, } from './../../../Components/AgGridComponent/Grid.d';
import OutgoingService from "Services/OutgoingShipmentService";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules//dist/styles/ag-theme-alpine.css';

type DataT = IAggregateDetailDTO;
type Ctx = any;
type CellRendererParams<V> = GridRendererParams<V, DataT, Ctx>;
function field(name: keyof IAggregateDetailDTO) {
    return name;
}
function QuantityCellRenderer(params: CellRendererParams<number>) {
    return getQuantityInText(params.value, params.data.CaretSize);
}
type TotalCellData = {
    Quantity: number;
    Price: number;
}
type PinnedRowData = {
    ProductId: null,
    FlavourId: null,
    UnitPrice: null,
    TotalQuantityTaken: null;
    TotalQuantityReturned: null;
    TotalQuantityShiped: number;
    SchemeInfo: TotalCellData;
    CustomCaratPrices: number;
    NetPrice: number;
}
const options: GridOptions = {
    frameworkComponents: {
        schemeRenderer: function (params: CellRendererParams<SchemeInfo>) {
            return showQuantityAndPrice(params.data.SchemeInfo.TotalQuantity + '', params.data.SchemeInfo.TotalSchemePrice);
        },
        schemeTotalRenderer: function (params: CellRendererParams<TotalCellData>) {
            return showQuantityAndPrice(params.value.Quantity + '', params.value.Price);
        },
        customPriceRenderer: function (params: CellRendererParams<CustomCaratPrice>) {
            if (params.value.Prices.length == 0)
                return "N/A";
            return params.value.Prices.map(e => `${getQuantityInText(e.Quantity, params.data.CaretSize)}->${e.PricePerCarat}`).join('+').concat("=", `${getQuantityInText(params.value.TotalQuantity, params.data.CaretSize)}->${params.value.TotalPrice}`);
        },
        saleRenderer: QuantityWithPriceCellRenderer((e: CellRendererParams<number>) => e.value, (e: CellRendererParams<number>) => e.data.TotalSalePrice, (e: CellRendererParams<number>) => e.data.CaretSize),
        priceRenderer: function (params: CellRendererParams<any>) {
            return getPriceInText(params.value);
        }
    },
    defaultColDef: {
        editable: false,
    },
    columnDefs: [
        {
            headerName: getColumnName('ProductId'),
            field: field('ProductId')
        },
        {
            headerName: getColumnName('FlavourId'),
            field: field('FlavourId')
        },
        {
            headerName: getColumnName('UnitPrice'),
            field: field('UnitPrice')
        },
        {
            headerName: getColumnName('TotalQuantityTaken'),
            field: field('TotalQuantityTaken'),
            cellRenderer: QuantityCellRenderer
        },
        {
            headerName: getColumnName('TotalQuantityReturned'),
            field: field('TotalQuantityReturned'),
            cellRenderer: QuantityCellRenderer
        },
        {
            headerName: getColumnName('TotalQuantityShiped'),
            field: field('TotalQuantityShiped'),
            cellRendererSelector: function (params: ICellRendererParams) {
                if (params.node.rowPinned) {
                    return {
                        component: 'priceRenderer'
                    }
                }
                return {
                    component: 'saleRenderer'
                }
            }
        },
        {
            headerName: "Scheme",
            field: field('SchemeInfo'),
            cellRendererSelector: function (params) {
                if (params.node.rowPinned) {
                    return {
                        component: 'schemeTotalRenderer'
                    }
                }
                return {
                    component: 'schemeRenderer'
                }
            }
        },
        {
            headerName: "Custom Carat",
            field: field('CustomCaratPrices'),
            cellRendererSelector: function (params) {
                if (params.node.rowPinned) {
                    return {
                        component: undefined
                    }
                }
                return {
                    component: 'customPriceRenderer'
                }
            },
        },
        {
            headerName: 'Net Price',
            field: field('NetPrice'),
            valueFormatter: function (params: GridValueFormatterParams<number, DataT, Ctx>) {
                return "\u20B9" + params.value;
            }
        }
    ]
}
interface OutgoingGridViewProps extends RouteComponentProps<{ id: string }> {

}
export default function OutgoingGridView(props: OutgoingGridViewProps) {
    const { match: { params: { id } } } = props;
    const [data, setData] = useState<OutgoingShipmentView>();
    const [apiSatus, setApiStatus] = useState<ApiStatusInfo>({ Status: CallStatus.EMPTY });
    const [gridApi, setGridApi] = useState<GridApi>();
    const isIDValid = IsValidInteger(id);
    function onGridReady(params: GridReadyEvent) {
        setGridApi((api) => params.api);
    }

    useEffect(() => {
        if (isIDValid) {
            setApiStatus({Status:CallStatus.LOADING});
            new OutgoingService().GetDetails(Number.parseInt(id)).then(res => {
                setData(res.data);
                setApiStatus({ Status: CallStatus.LOADED });
            }).catch(e => {
                setApiStatus({ Status: CallStatus.ERROR });
            });
        }
    }, []);
    useEffect(() => {
        if (isIDValid && data) {
            const rowData: PinnedRowData[] = [{
                FlavourId: null,
                ProductId: null,
                UnitPrice: null,
                TotalQuantityTaken: null,
                TotalQuantityReturned: null,
                TotalQuantityShiped: data!.TotalSalePrice,
                SchemeInfo: { Price: data!.TotalSchemePrice, Quantity: data!.TotalSchemeQuantity },
                CustomCaratPrices: data!.CustomCaratTotalPrice,
                NetPrice: data!.TotalNetPrice
            }];
            gridApi?.setPinnedBottomRowData(rowData);
        }
    }, [data])

    if (!isIDValid)
        return <div className="alert" role="alert">Id Provided Not Valid</div>;

    return (<Loader Status={apiSatus.Status} Message={apiSatus.Message}>
        <div>
            <div className="d-flex">
                <div>
                    <div className="input-group-prepend">
                        <div className="input-group-text">Salesman Name</div>
                    </div>
                    <input type="text" className="form-control" value={data?.Salesman.FullName} />
                </div>
                <div>
                    <div className="input-group-prepend">
                        <div className="input-group-text">Shipment Status</div>
                    </div>
                    <input type="text" className="form-control" value={(Object.entries(OutgoingStatus).find((k, v) => v == data?.Status) || [0, 0])![1]} />
                </div>
            </div>
        </div >
        <div className="ag-theme-alphine" style={{ width: '100vw', height: '751px', overflow: 'visible' }}>
            <AgGridReact gridOptions={options} onGridReady={onGridReady} modules={AllCommunityModules} rowData={data?.OutgoingDetails}></AgGridReact>
        </div>
    </Loader>);
}