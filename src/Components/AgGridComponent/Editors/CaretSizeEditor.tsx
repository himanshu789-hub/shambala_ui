import CaretSize from 'Components/CaretSize/CaretSize'
import { forwardRef, useImperativeHandle, ComponentType, useState, useRef, useEffect } from 'react';
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
type CaretSizeSetterParams = Omit<ValueSetterParams, 'value'> & {
    oldValue: number;
    newValue: number;
}
type CaretSizeGetter = (params: CaretSizeGetterParams) => CaretSizeValue;
type CaretSizeSetter = (params: CaretSizeSetterParams) => boolean;

export const CaretSizeEditor = function <T extends (EditorParams)>(caretSizeFromParams: (e: T) => number, isEditable: (data: T) => boolean) {
    return forwardRef<ICellEditor, T>((props, ref) => {
        const inputRef = useRef<HTMLInputElement>(null);
        const value = props.value.Value;
        const minValue = props.value.MinLimit;
        const maxValue = props.value.MaxLimit;
        const caretSize = caretSizeFromParams(props);
        const [quanity, setQuantity] = useState<number>(value);

        useImperativeHandle(ref, () => {
            return {
                getValue() {
                    return quanity;
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
        return <CaretSize ref={inputRef} handleInput={setQuantity} Size={caretSize} Quantity={quanity} MaxLimit={maxValue} MinLimit={minValue} />;
    });
}
