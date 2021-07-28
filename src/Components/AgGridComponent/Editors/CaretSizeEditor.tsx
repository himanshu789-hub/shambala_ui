import { } from '@ag-grid-community/react/lib/reactComponent';
import CaretSize, { ICaretSizeProps } from 'Components/CaretSize/CaretSize'
import React, { forwardRef, Ref, useImperativeHandle } from 'react'
import { useRef } from 'react'
import { ICellEditor, ICellEditorComp, ICellEditorParams } from '@ag-grid-community/all-modules'
import { GridEditorParams, IRowValue } from '../Grid';
import { useState } from 'react';


export const CaretSizeEditor = forwardRef<Ref<ICellEditor>, GridEditorParams<number>>((props, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const value = props.value as number;
    const rowValue = props.data as IRowValue;
    const caretSize = rowValue.Shipment.CaretSize;
    const [quanity, setQuantity] = useState<number>(value);

    function isFlavourAvailable() {
        return rowValue.Shipment.FlavourId && rowValue.Shipment.FlavourId != -1;
    }
    useImperativeHandle(ref, () => {
        return {
            current: {
                getValue() {
                    return quanity;
                }
                , focusIn() {
                    if(isFlavourAvailable()){
                        rowValue.Observer.UnsubscribeToQuantity();
                    }
                    inputRef.current?.focus();
                },
                isCancelBeforeStart() {
                    return !isFlavourAvailable();
                }
            }
        }
    })
    return <CaretSize ref={inputRef} handleInput={setQuantity} Size={caretSize} Quantity={quanity} MaxLimit={rowValue.MaxLimit} MinLimit={rowValue.MinLimit}/>;
})