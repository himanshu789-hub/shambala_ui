import { ICellRendererParams } from '@ag-grid-community/all-modules';
import { getQuantityInText } from 'Utilities/Utilities';

export default function CaretSizeRenderer<T extends ICellRendererParams>(getCaretSizeFromDataFunc:(e:T)=>number) {
    return function (props: T) {
        const value = props.value as number;
        const caretSize = getCaretSizeFromDataFunc(props);
        if (!caretSize)
            return '--';
        return getQuantityInText(value, caretSize);
    };
}


