import { CellEditingStartedEvent, CellKeyDownEvent, KeyCode, KeyName } from "@ag-grid-community/all-modules";
import { forwardRef, MouseEvent, MouseEventHandler, useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { GridRendererParams } from "../Grid.d";

export type ActionCellParams = {
    addAChild(): void;
    deleteAChild(Id: string): void;
};
type ButtonProps = {
    handleClick: (e?: MouseEvent<HTMLButtonElement>) => void;
    classList?: string[];
    innerText: string | JSX.Element;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const { classList, handleClick, innerText } = props;

    return <button ref={ref} className={`btn btn-info ${classList && classList.toString().replaceAll(',', ' ')}`} onClick={handleClick}>{innerText}</button>
});

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
    })

    let minusButton = <Button classList={["btn-danger"]} handleClick={() => props.deleteAChild(props.value)} innerText={<i className="fa fa-minus"></i>} ref={minusRef}></Button>;
    let plusButton = <Button handleClick={props.addAChild} classList={["ml-1"]} innerText={<i className="fa fa-plus"></i>} ref={plusRef}></Button>
    if (IsLastRow)
        return (<div className="text-center">{minusButton}{plusButton}</div>);

    return <div className="text-center">{minusButton}</div>
}
