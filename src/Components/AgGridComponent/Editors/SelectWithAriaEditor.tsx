import { ICellEditor, ICellEditorComp, ICellEditorParams } from "@ag-grid-community/all-modules"
import ReactSelect, { ValueContainer } from "Components/Select/Select"
import { useImperativeHandle, useRef, forwardRef, useState, useEffect } from "react"

type SelectEditorProps = ICellEditorParams & {
    list: ValueContainer[];
    editable?(): boolean;
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
            getPopupPosition: function () {
                return "over";
            },
            isCancelBeforeStart: function () {
                if (props.editable)
                    return !props.editable();
                return false;
            }
        }
    });
    useEffect(() => {
        setTimeout(() => {
            inputRef.current?.focus();
        });
    }, [])
    return <ReactSelect onSelect={setSelectedValue} defaultValue={value} list={list} ref={inputRef} />
});




export const GridSelectEditor = function <DataT, _>(getProductListFromData: (e: DataT) => ValueContainer[], isEditable?: (data: DataT) => boolean) {


    return forwardRef<ICellEditor, ICellEditorParams>((props, ref) => {
        const [list, setList] = useState<ValueContainer[]>([]);
        useEffect(() => {
            setList(getProductListFromData(props.data));
        }, []);
        function canEdit() {
            return isEditable ? isEditable(props.data) : false;
        }
        return <SelectEditor {...props} list={list} ref={ref} editable={canEdit} />
    })
};