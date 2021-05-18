export function Heading(props: { label: string }) {
    return <h4 className="app-head">{props.label}</h4>;
}
export function Spinner(props: { show: boolean }) { 
    return <i className={props.show ? 'fa fa-spinner fa-spin' : ''} ></i >; 
}