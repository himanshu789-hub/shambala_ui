import { RouteComponentProps } from "react-router";

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