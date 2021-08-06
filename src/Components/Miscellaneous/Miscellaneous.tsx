import React, { forwardRef } from "react";
import { RouteComponentProps } from "react-router";
import { ButtonProps } from './Miscellaneous.d';

export function Heading(props: { label: string }) {
    return <h4 className="app-head">{props.label}</h4>;
}
export function Spinner(props: { show: boolean }) {
    return <i className={props.show ? 'fa fa-spinner fa-spin' : ''} ></i >;
}


export interface IIdComponent extends RouteComponentProps<{ id?: string }> {
    Id?: number;
}
export function Add_Update_Wrapper(props: RouteComponentProps<{ id?: string }>, Component: React.ComponentType<IIdComponent>) {
    const params = props.match.params;
    if (!(params.id))
        return <Component  {...props} />
    const Id = params.id!;
    if (Number.parseInt(Id)) {
        return <Component Id={Number.parseInt(Id)}  {...props} />
    }
    else
        return <div className="alert alter-danger">Invalid Route</div>;
}
const EmptyIcon = () => <img src="/glassbin.svg" width="200px" height="200px" />;
export function EmptyTableBody(props: { numberOfColumns: number }) {
    return <React.Fragment><tr><td colSpan={props.numberOfColumns} rowSpan={3}  ><span className="d-inline-flex flex-column text-danger-grad"><EmptyIcon /><span>Not Found</span></span></td></tr></React.Fragment>
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const { className, handleClick } = props;
    return <button ref={ref} className={`btn ${className}`} onClick={handleClick}>{props.children}</button>
});
