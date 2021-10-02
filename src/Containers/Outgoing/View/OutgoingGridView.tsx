import { AgGridReact } from "@ag-grid-community/react";
import { GridOptions } from '@ag-grid-community/all-modules';
import { RouteComponentProps } from "react-router";
import { getPriceInText, getQuantityInText, IsValidInteger } from "Utilities/Utilities";
import { useEffect, useState } from "react";
import { CustomCaratPrice, IAggregateDetailDTO, IOutgoingShipmentUpdateDetail, OutgoingShipmentView, SchemeInfo } from "Types/DTO";
import Loader, { ApiStatusInfo, CallStatus } from "Components/Loader/Loader";
import { OutgoingStatus } from "Enums/Enum";
import { CellClassParams, GridApi, GridReadyEvent, ICellRendererParams } from "@ag-grid-community/core";
import { getColumnName } from "../Helpher";
import { QuantityWithPriceCellRenderer, showQuantityAndPrice } from "../Components/Renderers/Renderers";
import { GridRendererParams, GridValueFormatterParams, GridValueParserParams, } from './../../../Components/AgGridComponent/Grid.d';
import OutgoingService from "Services/OutgoingShipmentService";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules//dist/styles/ag-theme-alpine.css';
import './../Add_Update/OutgoingGrid.css';
import { Heading } from "Components/Miscellaneous/Miscellaneous";
type DataT = IAggregateDetailDTO;
type Ctx = any;
type CellRendererParams<V> = GridRendererParams<V, DataT, Ctx>;
function field(name: keyof IAggregateDetailDTO) {
    return name;
}
function QuantityCellRenderer(params: CellRendererParams<number>) {
    return getQuantityInText(params.value, params.data.CaretSize);
}
type PinnedRowData = {
    ProductName: null,
    FlavourName: null,
    UnitPrice: null,
    TotalQuantityTaken: null;
    TotalQuantityReturned: "Total";
    TotalQuantityShiped: number;
    SchemeInfo: SchemeInfo;
    CustomCaratPrices: number;
    NetPrice: number;
}
const options: GridOptions = {
    frameworkComponents: {
        schemeRenderer: function (params: CellRendererParams<SchemeInfo>) {
            return showQuantityAndPrice(params.value.TotalQuantity + '', params.value.TotalSchemePrice);
        },
        customPriceRenderer: function (params: CellRendererParams<CustomCaratPrice>) {
            if (params.value.Prices.length == 0)
                return "N/A";
            return (<table className="c-table">
                <thead><tr><th>Qty</th><th>PrPerCarat</th></tr></thead>
                <tbody>{
                    params.value.Prices.map(e => <tr><td>{getQuantityInText(e.Quantity, params.data.CaretSize)}</td>
                        <td>{getPriceInText(e.PricePerCarat)}</td></tr>).concat(
                            <tr className="bg-dark text-light"><td>{"Total"}</td><td>{getPriceInText(params.value.TotalPrice)}</td></tr>
                        )
                }
                </tbody>
            </table>);
        },
        saleRenderer: QuantityWithPriceCellRenderer((e: CellRendererParams<number>) => e.value, (e: CellRendererParams<number>) => e.data.TotalShipedPrice, (e: CellRendererParams<number>) => e.data.CaretSize),
        priceRenderer: function (params: CellRendererParams<number>) {
            return getPriceInText(params.value);
        },
        quantityRenderer: QuantityCellRenderer
    },
    defaultColDef: {
        flex: 1,
        editable: false
    },
    columnDefs: [
        {
            headerName: getColumnName('ProductId'),
            field: field('ProductName')
        },
        {
            headerName: getColumnName('FlavourId'),
            field: field('FlavourName')
        },
        {
            headerName: getColumnName('UnitPrice'),
            field: field('UnitPrice'),
            valueFormatter: function (params) {
                if (!params.value)
                    return '';
                return getPriceInText(params.value);
            }
        },
        {
            headerName: getColumnName('TotalQuantityTaken'),
            field: field('TotalQuantityTaken'),
            cellRendererSelector: function (params) {
                if (params.node.rowPinned) {
                    return {
                        component: undefined
                    }
                }
                return {
                    component: 'quantityRenderer'
                }
            }
        },
        {
            headerName: getColumnName('TotalQuantityReturned'),
            field: field('TotalQuantityReturned'),
            cellRendererSelector: function (params) {
                if (params.node.rowPinned) {
                    return {
                        component: undefined
                    }
                }
                return {
                    component: 'quantityRenderer'
                }
            }
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
            },
            cellClassRules: {
                'line-height': (params: CellClassParams) => !params.node.rowPinned
            }
        },
        {
            headerName: "Scheme",
            field: field('SchemeInfo'),
            cellRenderer:'schemeRenderer',
            cellClass: "line-height"
        },
        {
            headerName: "Custom Carat",
            field: field('CustomCaratPrices'),
            cellRendererSelector: function (params) {
                if (params.node.rowPinned) {
                    return {
                        component: 'priceRenderer'
                    }
                }
                return {
                    component: 'customPriceRenderer'
                }
            }
        },
        {
            headerName: 'Net Price',
            field: field('NetPrice'),
            valueFormatter: function (params: GridValueFormatterParams<number, DataT, Ctx>) {
                return "\u20B9" + params.value;
            }
        }
    ],
    rowHeight:100
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
            setApiStatus({ Status: CallStatus.LOADING });
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
                FlavourName: null,
                ProductName: null,
                UnitPrice: null,
                TotalQuantityTaken: null,
                TotalQuantityReturned: "Total",
                TotalQuantityShiped: data!.TotalShipedPrice,
                SchemeInfo: { TotalSchemePrice: data!.TotalSchemePrice, TotalQuantity: data!.TotalSchemeQuantity,SchemeQuantity:-1 },
                CustomCaratPrices: data!.CustomCaratTotalPrice,
                NetPrice: data!.TotalNetPrice
            }];
            gridApi?.setPinnedBottomRowData(rowData);
        }
    }, [data])

    if (!isIDValid)
        return <div className="alert" role="alert">Id Provided Not Valid</div>;

    return (<Loader Status={apiSatus.Status} Message={apiSatus.Message}>
        <Heading label="View Shipment" />
        <div className="m-2">
            <div className="d-flex">
                <div className="input-group">
                    <div className="input-group-prepend">
                        <div className="input-group-text">Salesman Name</div>
                    </div>
                    <input type="text" className="form-control" value={data?.Salesman?.FullName} />
                </div>
                <div className="input-group">
                    <div className="input-group-prepend">
                        <div className="input-group-text">Shipment Status</div>
                    </div>
                    <input type="text" className="form-control" value={(Object.entries(OutgoingStatus).find((k, v) => v == data?.Status) || [0, 0])![1]} />
                </div>
            </div>
        </div>
        <div className="ag-theme-alpine" style={{ width: '100vw', height: '500px', overflow: 'visible' }}>
            <AgGridReact gridOptions={options} onGridReady={onGridReady} modules={AllCommunityModules} rowData={data?.OutgoingShipmentDetails || []}></AgGridReact>
        </div>
    </Loader>);
}