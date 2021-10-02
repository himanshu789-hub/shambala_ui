import React from 'react';
import { ColumnApi, GridApi, GridOptions, GridReadyEvent } from '@ag-grid-community/core';
import { AgGridReact } from '@ag-grid-community/react';
import { CreditType } from 'Enums/Enum';
import { ValueContainer } from 'Components/Select/Select';
import { GridSelectEditor } from 'Components/AgGridComponent/Editors/SelectWithAriaEditor';
import { NumericOnlyEditor, MaxTenEditor } from '../Editors/NumericOnlyEditor';
import { CreditAndNetHolderDTO } from 'Types/DTO.d';
import CellClassRuleSpecifier from 'Components/AgGridComponent/StyleSpeficier/ShipmentCellStyle';
import { CreditAndNetHolderValidation } from 'Validation/CreditAndNetHolderValidation';
import { ToolTipComponent, ToolTipGetter } from 'Components/AgGridComponent/Renderer/ToolTipRenderer';

const TypeEditor = GridSelectEditor(e => Object.entries(CreditType).map(e => ({ label: e[0], value: e[1] } as ValueContainer)), (e) => true)

const StyleViewer = (name: keyof CreditAndNetHolderDTO)=>CellClassRuleSpecifier<CreditAndNetHolderDTO, CreditAndNetHolderValidation>(name, CreditAndNetHolderValidation);
const ToolYipValueGetter= (name:keyof CreditAndNetHolderDTO)=>ToolTipGetter<CreditAndNetHolderDTO,CreditAndNetHolderValidation>(CreditAndNetHolderValidation,name)
type ShipmentInfo = {
    Id: number;
    RowVersion: number;
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
const options: GridOptions = {
    defaultColDef: {
        flex: 1,
        autoHeight: true,
        tooltipComponentFramework:ToolTipComponent,
        
    },
    columnDefs: [
        {
            headerName: 'Type',
            field: 'Type',
            cellEditorFramework: TypeEditor
        },
        {
            headerName: 'Amount',
            field: 'Amount',
            cellEditorFramework: NumericOnlyEditor
        },
        {
            headerName: 'TotalQty',
            field: 'Qty',
            cellEditorFramework: MaxTenEditor
        }
    ]
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
    render() {

        return (<div>
            <AgGridReact gridOptions={options} onGridReady={this.onGridReady}></AgGridReact>
            <div className="d-flex">
                <button className="col btn btn-warning">Calculate</button>
                <button className="col btn btn-info" onClick={this.handleSubmit}>Submit</button>
            </div>
        </div>);
    }
}