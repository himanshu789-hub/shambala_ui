import {KeyName } from "@ag-grid-community/all-modules";
import { useRef } from "react";
import { useEffect } from "react";
import { GridRendererParams } from "../Grid.d";
import {Button} from 'Components/Miscellaneous/Miscellaneous';

export type ActionCellParams = {
    addAChild(): void;
    deleteAChild(Id: string): void;
};

type ActionCellRendererParams = GridRendererParams<string> & ActionCellParams;

export default function ActionCellRenderer(props: ActionCellRendererParams) {
    const minusRef = useRef<HTMLButtonElement>(null);
    const plusRef = useRef<HTMLButtonElement>(null);
    const IsLastRow = props.api.getDisplayedRowCount() - 1 === props.rowIndex;

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
        props.eGridCell.addEventListener('keydown',onKeyDownEvent);
        return () => {
            props.eGridCell.removeEventListener('keyup', onKeyUpEvent);
            props.eGridCell.removeEventListener('keydown',onKeyDownEvent);
        }
    });

    let minusButton = <Button className="btn-danger" handleClick={() => props.deleteAChild(props.value)}  ref={minusRef}><i className="fa fa-minus"></i></Button>;
    let plusButton = <Button handleClick={props.addAChild} className="btn-warn ml-1" ref={plusRef} ><i className="fa fa-plus"></i></Button>
    if (IsLastRow)
        return (<div className="text-center">{minusButton}{plusButton}</div>);

    return <div className="text-center">{minusButton}</div>
}
