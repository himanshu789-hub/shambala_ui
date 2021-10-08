import { ICellRendererParams } from '@ag-grid-community/all-modules';
import { ValueContainer } from 'Components/Select/Select';



export function SelectWithAriaRenderer<T extends ICellRendererParams>(getListFromParams: (params: T) => ValueContainer[], isValid: (params:T) => boolean) {
    return (params: T) => {
        if (!isValid(params))
            return '##';
        return getListFromParams(params).find(e => e.value === params.value)?.label ?? 'N/A';
    }
}