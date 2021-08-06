import { ICellRendererParams } from '@ag-grid-community/all-modules';
import { getQuantityInText } from 'Utilities/Utilities';

export default function CaretSizeRenderer<DataT>(getCaretSizeFromDataFunc:(e:DataT)=>number) {
    return function (props: ICellRendererParams) {
        const value = props.value as number;
        const caretSize = getCaretSizeFromDataFunc(props.data);
        if (!caretSize)
            return '--';
        return getQuantityInText(value, caretSize);
    };
}


