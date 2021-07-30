import { ICellEditor, ICellEditorComp, ICellEditorParams } from "@ag-grid-community/all-modules"
import ReactSelect, { ValueContainer } from "Components/Select/Select"
import { useImperativeHandle, useRef } from "react"
import { useEffect } from "react"
import { useState } from "react"
import { Ref } from "react"
import { forwardRef } from "react"
import { GridEditorParams } from "../Grid"

type SelectEditorProps = GridEditorParams<number> & {
    list: ValueContainer[]
}
const SelectEditor = forwardRef<ICellEditor, SelectEditorProps>((props, ref) => {
    const { value, list } = props;
    const [selectedValue, setSelectedValue] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => {
        return {
            getValue() {
                return selectedValue;
            },
            focusIn() {
                inputRef.current?.focus();
            },
            isPopup() {
                return true;
            },
            getPopupPosition:function(){
                return "over";
            }
        }
    });
    useEffect(()=>{
       setTimeout(() => {
        inputRef.current?.focus();
       });
    },[])
    return <ReactSelect onSelect={setSelectedValue} list={list} ref={inputRef} />
});
export const GridProductSelectEditor = forwardRef<ICellEditor, GridEditorParams<number>>((props, ref) => {
    const [list, setList] = useState<ValueContainer[]>([]);
    useEffect(() => {
        const observer = props.data.Observer;
        if (observer) {
            setList(observer.GetProduct().map(e => ({ label: e.Title, value: e.Id })));
        }
    }, [])
    return <SelectEditor {...props} list={list} ref={ref} />
})

export const GridFlavourSelectEditor = forwardRef<ICellEditor, GridEditorParams<number>>((props, ref) => {
    const [list, setList] = useState<ValueContainer[]>([]);
    useEffect(() => {
        const observer = props.data.Observer;
        if (observer) {
            setList(observer.GetFlavours().map(e => ({ label: e.Title, value: e.Id })));
        }
    }, [])
    return <SelectEditor {...props} list={list} ref={ref} />
})

