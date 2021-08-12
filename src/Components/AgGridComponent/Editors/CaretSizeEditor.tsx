import CaretSize, { ICaretSizeProps } from 'Components/CaretSize/CaretSize'
import { forwardRef, useImperativeHandle, ComponentType, useState, useRef, useEffect } from 'react';
import { ICellEditor, ICellEditorParams } from '@ag-grid-community/all-modules'

export const CaretSizeEditor = function <EdiatorParams extends ICellEditorParams,_>(caretSizeFromParams:(e:EdiatorParams)=>number,isEditable:(data:EdiatorParams)=>boolean) {
    return forwardRef<ICellEditor, EdiatorParams>((props, ref) => {
        const inputRef = useRef<HTMLInputElement>(null);
        const value = props.value;
        const rowValue = props.data;
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
        return <CaretSize ref={inputRef} handleInput={setQuantity} Size={caretSize} Quantity={quanity} MaxLimit={rowValue.MaxLimit} MinLimit={rowValue.MinLimit} />;
    });
}
