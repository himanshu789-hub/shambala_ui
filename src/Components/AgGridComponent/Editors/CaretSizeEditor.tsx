import CaretSize, { ICaretSizeProps } from 'Components/CaretSize/CaretSize'
import React, { forwardRef, Ref, useImperativeHandle } from 'react'
import { useRef } from 'react'
import { ICellEditor } from '@ag-grid-community/all-modules'
import { GridEditorParams } from '../Grid';
import { useState } from 'react';
import { useEffect } from 'react';


export const CaretSizeEditor = forwardRef<ICellEditor, GridEditorParams<number>>((props, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const value = props.value;
    const rowValue = props.data;
    const caretSize = rowValue.Shipment.CaretSize;
    const [quanity, setQuantity] = useState<number>(value);
    function isFlavourAvailable() {
        return rowValue.Shipment.FlavourId && rowValue.Shipment.FlavourId != -1;
    }
    useImperativeHandle(ref, () => {
        return {
            getValue() {
                return quanity;
            },
            isPopup() {
                return true;
            },
            isCancelBeforeStart() {
                return !isFlavourAvailable();
            }
        }
    });
    useEffect(() => {
        setTimeout(() => {
            inputRef.current?.focus()
        });
    }, []);
    return <CaretSize handleInput={setQuantity} Size={caretSize} Quantity={quanity} MaxLimit={rowValue.MaxLimit} MinLimit={rowValue.MinLimit} />;
})