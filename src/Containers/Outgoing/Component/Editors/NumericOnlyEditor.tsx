import { ICellEditor, ICellEditorParams } from "@ag-grid-community/all-modules";
import { useRef } from "react";
import { useImperativeHandle } from "react";
import { forwardRef } from "react";

export default forwardRef<ICellEditor, ICellEditorParams>((props, ref) => {
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