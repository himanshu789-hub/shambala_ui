import CaretSize from 'Components/CaretSize/CaretSize'
import { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react';
import { ICellEditor, ICellEditorParams, ValueGetterParams, ValueSetterParams } from '@ag-grid-community/all-modules'

export type CaretSizeValue = {
    Value: number;
    MinLimit?: number;
    MaxLimit?: number;
}

type EditorParams = Omit<ICellEditorParams, 'value'> & {
    value: CaretSizeValue;
}
type CaretSizeGetterParams = Omit<ValueGetterParams, 'value'> & {
    value: CaretSizeValue;
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
                    const isMinValid = minValue ? quantity >= minValue : true;
                    const isMaxValid = maxValue ? quantity <= maxValue : true;
                    return { IsValid: isMinValid && isMaxValid, Value: quantity };
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
