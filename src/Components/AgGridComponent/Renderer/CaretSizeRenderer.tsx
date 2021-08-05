import { ICellRendererParams } from '@ag-grid-community/all-modules';
import { ShipmentDTO } from 'Types/DTO';
import { getQuantityInText } from 'Utilities/Utilities';
import { GridGetterParams, GridSetterParams, IRowValue } from '../Grid.d';

export default function CaretSizeValueRenderer(props: ICellRendererParams) {
    const value = props.value as number;
    const caretSize = (props.data as IRowValue).Shipment.CaretSize;
    if (!caretSize)
        return '--';
    return getQuantityInText(value, caretSize);
}

export function CaretSizeValueGetter(props: GridGetterParams) { return props.data.Shipment.TotalRecievedPieces };
export const CaretSizeValueSetter = (props: GridSetterParams<ShipmentDTO['CaretSize']>) => {
    props.data.Shipment.TotalRecievedPieces = props.newValue;
    return true;
}

