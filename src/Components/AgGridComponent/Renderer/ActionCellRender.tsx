import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { ShipmentDTO } from "Types/DTO";
import { KeyCode } from "Utilities/Utilities";
import { GridRendererParams } from "../Grid";

export type ActionCellParams = {
    addAChild(): void;
    deleteAChild(Id: number): void;
};
type ActionCellRendererParams = GridRendererParams<ShipmentDTO['Id']> & ActionCellParams;

export default function ActionCellRenderer(props: ActionCellRendererParams) {
    const inputRef = useRef<HTMLButtonElement>(null);
    const [isonAdd, SetIsOnAdd] = useState<boolean>(true);
    function onClick() {
        if (isonAdd) {
            SetIsOnAdd(false);
            props.addAChild();
        }
        else
            props.deleteAChild(props.value);
    }

    const eventListener = function (event: KeyboardEvent) {
        if (event.keyCode === KeyCode.ENTER) {
            inputRef.current?.focus();
        }
    };
    function removeEventListener() {
        props.eGridCell.removeEventListener('keyup', eventListener);
    }

    useEffect(() => {
        props.eGridCell.addEventListener('keyup', eventListener);
        return () => {
            removeEventListener();
        }
    }, [inputRef.current])

    useEffect(() => {
        return () => {
            removeEventListener()
        }
    }, []);
    let button = <button ref={inputRef} className="btn btn-info" onClick={onClick}><i className="fa fa-plus"> </i></button>;
    if (!isonAdd)
        button = <button ref={inputRef} className="btn btn-danger" onClick={onClick}><i className="fa fa-minus">  </i></button>;
    return <div className="text-center">{button}</div>
}
