import { useRef,useImperativeHandle,forwardRef } from "react";
import { ICellEditor, ICellEditorParams } from "@ag-grid-community/all-modules";
import { CellEditorParams,OutgoingUpdateRow } from "Containers/Outgoing/Add_Update/OutgoingGrid.d";

export const NumericOnlyEditor =  forwardRef<ICellEditor, ICellEditorParams>((props, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => ({
        getValue() {
            const value = inputRef.current?.value;
            if (!value)
                return 0;
            return Number.parseFloat(value);
        }
    }))
    setTimeout(() => (inputRef.current?.focus()));
    return <input ref={inputRef} pattern="^[0-9]+(\.[0-9]{1,2})?$" defaultValue={props.value} />
})
export const MaxTenEditor = forwardRef<ICellEditor,CellEditorParams<OutgoingUpdateRow['SchemeInfo']>>((props,ref)=>{
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref,()=>({
        getValue(){
            const value = inputRef.current?.value;
            if (!value)
                return 0;
            return Number.parseInt(value);
        }
    }));
    setTimeout(() => (inputRef.current?.focus()));
    return <input ref={inputRef} type="number" max="10" min="0" step="1" defaultValue={props.value.SchemeQuantity} />
})