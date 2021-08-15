import CaretSize from 'Components/CaretSize/CaretSize'
import { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react';
import { CellValueChangedEvent, ICellEditor, ICellEditorParams, ValueGetterParams, ValueSetterParams } from '@ag-grid-community/all-modules'
import CustomPriceValidation from 'Validation/CustomPriceValidation';
import CaretQuantiyValidation from 'Validation/CaretQuantityValidation';

export type CaretSizeValue = {
    Value: number;
    MinLimit?: number;
    MaxLimit?: number;
}

type EditorParams = Omit<ICellEditorParams, 'value'> & {
    value: CaretSizeValue;
}
// type CaretSizeGetterParams = Omit<ValueGetterParams, 'value'> & {
//     value: CaretSizeValue;
// }
export const CaretSizeCellEquals = function (previousValue: CaretSizeValue, newValue: CaretSizeNewValue) {
    return previousValue.Value === newValue.Value;
}
type CaretSizeNewValue = { IsValid: boolean, Value: number };
// export type CaretSizeSetterParams = Omit<ValueSetterParams, 'newValue' | 'oldValue'> & {
//     oldValue: CaretSizeValue;
//     newValue: CaretSizeNewValue;
// }

// export type CaretSizeGetter = (params: CaretSizeGetterParams) => CaretSizeValue;
// export type CaretSizeSetter = {
//     (params: CaretSizeSetterParams): boolean
// };
export type CaretSizeEditorValueSetterParams<T extends ValueSetterParams> = Omit<T, 'newValue' | 'oldValue'> & {
    oldValue: CaretSizeValue,
    newValue: CaretSizeNewValue
}
export type CaretSizeCellValueChangeEvemt<DataT, CtxT> = Omit<CellValueChangedEvent, 'newValue' | 'oldValue' | 'value' | 'data' | 'context'> & {
    newValue: CaretSizeNewValue;
    oldValue: CaretSizeValue;
    data: DataT,
    context: CtxT,
    value: CaretSizeValue
}
export const CaretSizeEditor = function <T extends (EditorParams)>(caretSizeFromParams: (e: T) => number, isEditable: (data: T) => boolean) {
    return forwardRef<ICellEditor, T>((props, ref) => {
        const inputRef = useRef<HTMLInputElement>(null);
        const value = props.value.Value;
        const minValue = props.value.MinLimit;
        const maxValue = props.value.MaxLimit;
        const caretSize = caretSizeFromParams(props);
        const [quantity, setQuantity] = useState<number>(value);

        useImperativeHandle(ref, () => {
            return {
                getValue() {
                    return { IsValid:new CaretQuantiyValidation({Value:quantity,MaxLimit:maxValue,MinLimit:minValue}).IsQuantityValid(), Value: quantity };
                },
                isPopup() {
                    return true;
                },
                isCancelBeforeStart() {
                    return isEditable(props.data);
                }
            }
        });
        useEffect(() => {
            setTimeout(() => {
                inputRef.current?.focus()
            });
        }, []);
        return <CaretSize ref={inputRef} handleInput={setQuantity} Size={caretSize} Quantity={quantity} MaxLimit={maxValue} MinLimit={minValue} />;
    });
}
