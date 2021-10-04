import React from 'react';
import { ColumnApi, GridApi, GridOptions, GridReadyEvent } from '@ag-grid-community/core';
import { AgGridReact } from '@ag-grid-community/react';
import { CapitalType, Medium } from 'Enums/Enum';
import { ValueContainer } from 'Components/Select/Select';
import { GridSelectEditor } from 'Components/AgGridComponent/Editors/SelectWithAriaEditor';
import { NumericOnlyEditor, MaxTenEditor } from '../Editors/NumericOnlyEditor';
import { CreditAndNetHolderDTO } from 'Types/DTO.d';
import CellClassRuleSpecifier from 'Components/AgGridComponent/StyleSpeficier/ShipmentCellStyle';
import { CreditAndNetHolderValidation } from 'Validation/CreditAndNetHolderValidation';
import { ToolTipComponent, ToolTipGetter } from 'Components/AgGridComponent/Renderer/ToolTipRenderer';
import { addDecimal, getPriceInText } from 'Utilities/Utilities';
import { CellRendererParams, ValueParserParams, ValueFormatterParams, EditableParams } from './CreditAndNetHolder.d';

const MediumEditor = GridSelectEditor(e => Object.entries(Medium).map(e => ({ label: e[0], value: e[1] } as ValueContainer)), (e) => true)
const TypeEditor = GridSelectEditor(e => Object.entries(CapitalType).map(e => ({ label: e[0], value: e[1] } as ValueContainer)), (e) => true)
const StyleViewer = (name: keyof CreditAndNetHolderDTO) => CellClassRuleSpecifier<CreditAndNetHolderDTO, CreditAndNetHolderValidation>(name, CreditAndNetHolderValidation);
const ToolTipValueGetter = (name: keyof CreditAndNetHolderDTO) => ToolTipGetter<CreditAndNetHolderDTO, CreditAndNetHolderValidation>(CreditAndNetHolderValidation, name)

type ShipmentInfo = {
    Id: number;
    RowVersion: number;
    RawPirce: number;
}

type CreditAndNetHolderProps = {
    Items: CreditAndNetHolder[];
    ShouldPost: number;
    InitailData: ShipmentInfo;
    submitValues?(data: CreditAndNetHolderDTO[]): void;

}
type CreditAndNetHolderState = {
    GridApis: { api: GridApi, columnApi: ColumnApi }
}
function getColId(name: keyof CreditAndNetHolderDTO) {
    let colId;
    switch (name) {
        case 'Amount':
            colId = 1;
            break;
        case 'Medium':
            colId = 2;
            break;
        case 'Qty':
            colId = 3;
            break;
        case 'Type':
            colId = 4;
            break;
    }
    return colId + '';
}
const options: GridOptions = {
    defaultColDef: {
        flex: 1,
        autoHeight: true,
        editable: true,
        tooltipComponentFramework: ToolTipComponent,
    },
    columnDefs: [
        {
            headerName: '',
            field: 'Medium',
            cellEditorFramework: MediumEditor,
            cellClassRules: StyleViewer('Medium'),
            colId: getColId('Medium'),
            editable: false,
            tooltipValueGetter: ToolTipValueGetter('Medium'),
            valueFormatter: function (params: ValueFormatterParams<number>) {
                if (params.value === Medium.CASH)
                    return "CASH";
                if (params.data.Type === CapitalType.CREDIT)
                    return "NEW CHEQUE"
                if (params.data.Type === CapitalType.DEBIT)
                    return "OLD CHEQUE";
                return "";
            }
        },
        {
            headerName: 'Type',
            field: 'Type',
            editable: false,
            cellEditorFramework: TypeEditor,
            cellClassRules: StyleViewer('Type'),
            colId: getColId('Type'),
            tooltipValueGetter: ToolTipValueGetter('Type')
        },
        {
            headerName: 'Amount',
            field: 'Amount',
            cellEditorFramework: NumericOnlyEditor,
            cellClassRules: StyleViewer('Amount'),
            colId: getColId('Amount'),
            tooltipValueGetter: ToolTipValueGetter('Amount')
        },
        {
            headerName: 'Qty',
            field: 'Qty',
            cellEditorFramework: MaxTenEditor,
            cellClassRules: StyleViewer('Qty'),
            colId: getColId('Qty'),
            editable: function (params: EditableParams) {
                return params.data.Medium !== Medium.CASH;
            },
            tooltipValueGetter: ToolTipValueGetter('Qty')
        }
    ],
    onCellEditingStarted: function (params) {
        if (document.getElementsByClassName('ag-floating-cell')) {
            params.api.setPinnedBottomRowData([]);
        }
    }
}
function getPinnedRowData(data: CreditAndNetHolderDTO[], rawPirce: number): any {
    let result = rawPirce;
    for (const v of data) {
        if (v.Type === CapitalType.CREDIT) {
            result = addDecimal(result, -v.Amount);
        }
        result = addDecimal(result, v.Amount);
    }
    return {
        Medium: undefined,
        Type: undefined,
        Amount: undefined,
        Qty: getPriceInText(result)
    }
}
export default class CreditAndNetHolder extends React.Component<CreditAndNetHolderProps, CreditAndNetHolderState>
{
    constructor(props: CreditAndNetHolderProps) {
        super(props);
    }
    onGridReady = (event: GridReadyEvent) => {
        this.setState({ GridApis: { api: event.api, columnApi: event.columnApi } });
    }
    handleSubmit = () => {
        const { ShouldPost } = this.props;
        if (ShouldPost) {
            
            return;
        }
        const { submitValues } = this.props;
        if (submitValues) {
            const data = this.getAllRows();
            if (!this.isValid(data)) {
                alert('Please, Fill Properly');
                return;
            }
            submitValues(data);
            return;
        }
        alert('Submit Handler Undefined');
    }
    isValid = (data?: CreditAndNetHolderDTO[]) => {
        if (document.getElementById('.is-invalid')) {
            return false;
        }
        let arr = data;
        if (!data) {
            arr = this.getAllRows();
        }
        let isValid = true;
        isValid = arr!.find(e => e.Qty == 0 || e.Amount == 0) == undefined;
        return isValid;
    }

    getAllRows = (): CreditAndNetHolderDTO[] => {
        const data: CreditAndNetHolderDTO[] = [];
        this.state.GridApis.api.forEachNode(node => data.push(node.data))
        return data;
    }
    handleCalculate = () => {
        if (this.isValid()) {
            const data = this.getAllRows();
            this.state.GridApis.api.setPinnedBottomRowData([getPinnedRowData(data, this.props.InitailData.RawPirce)])
            return;
        }

    }
    render() {

        return (<div className="ag-theme-alpine">
            <AgGridReact gridOptions={options} onGridReady={this.onGridReady}></AgGridReact>
            <div className="d-flex">
                <button className="col btn btn-warning" onClick={this.handleCalculate}>Calculate</button>
                <button className="col btn btn-info" onClick={this.handleSubmit}>Submit</button>
            </div>
        </div>);
    }
}