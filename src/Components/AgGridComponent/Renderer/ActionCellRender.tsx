import { ICellRendererParams, KeyName } from "@ag-grid-community/all-modules";
import { useRef, useEffect } from "react";
import { Button } from 'Components/Miscellaneous/Miscellaneous';
import { GridRendererParams } from "../Grid";

export type ActionCellParams<V> = {
    addAChild(): void;
    deleteAChild(Id: V): void;
};

type ActionCellRendererParams<T> = Omit<ICellRendererParams, 'value'> & { value: T } & ActionCellParams<T>;

export default function ActionCellRenderer<T>(props: ActionCellRendererParams<T>) {
    const minusRef = useRef<HTMLButtonElement>(null);
    const plusRef = useRef<HTMLButtonElement>(null);
    const IsLastRow = props.api?.getDisplayedRowCount() - 1 === props.rowIndex;

    useEffect(() => {
        function onKeyUpEvent(event: KeyboardEvent) {
            if (event.key === "Enter") {
                if (IsLastRow)
                    setTimeout(() => plusRef.current?.focus());
                else
                    setTimeout(() => minusRef.current?.focus());
            }
        }
        function onKeyDownEvent(event: KeyboardEvent) {
            if (IsLastRow && event.key === KeyName.LEFT && document.activeElement === plusRef.current) {
                event.preventDefault();
                minusRef.current?.focus();
            }
            if (IsLastRow && event.key === KeyName.RIGHT && document.activeElement === minusRef.current) {
                plusRef.current?.focus();
            }

        }
        props.eGridCell.addEventListener('keyup', onKeyUpEvent);
        props.eGridCell.addEventListener('keydown', onKeyDownEvent);
        return () => {
            props.eGridCell.removeEventListener('keyup', onKeyUpEvent);
            props.eGridCell.removeEventListener('keydown', onKeyDownEvent);
        }
    });
    function handleClick(action: "add" | "del") {
        if (action === 'add') {
            props.addAChild()
        }
        else {
            props.deleteAChild(props.value);
        }
        props.api.setFocusedCell(props.rowIndex, props.column!);
    }
    let minusButton = <Button className="btn-danger btn-sm" handleClick={() => handleClick('del')} ref={minusRef}><i className="fa fa-minus"></i></Button>;
    let plusButton = <Button handleClick={() => handleClick('add')} className="btn-warn ml-1 btn-sm" ref={plusRef} ><i className="fa fa-plus"></i></Button>
    if (IsLastRow)
        return (<div className="text-center">{minusButton}{plusButton}</div>);

    return <div className="text-center">{minusButton}</div>
}
