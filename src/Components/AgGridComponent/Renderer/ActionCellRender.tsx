import { ICellRendererParams } from "@ag-grid-community/all-modules";
import { ShipmentDTO } from "Types/DTO";
import { GridRendererParams } from "../Grid";

export type ActionCellParams = {
    addAChild(): void;
    deleteAChild(Id: number): void;
};
type ActionCellRendererParams = GridRendererParams<ShipmentDTO['Id']> & ActionCellParams;

export default function ActionCellRenderer(props: ActionCellRendererParams) {
    if (props.node.lastChild) {
         return <button className="btn btn-danger" onClick={props.addAChild}><i className="fa fa-plus"> + </i></button>;
    }
    return <button className="btn btn-info" onClick={()=>props.deleteAChild(props.value)}><i className="fa fa-plus"> - </i></button>;
}