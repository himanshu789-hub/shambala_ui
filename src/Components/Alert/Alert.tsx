

import './Alert.css';

type AlertProps = {
    togglePopUp(): void;
    message: string;
}

export default function Alert(props: AlertProps) {
    const handleRemove = () => {
        document.getElementById('alert-box')?.classList.add('alert-remove');
        setTimeout(() => { props.togglePopUp() }, 1000);
    };
    return (
        <div className="d-flex align-items-center alert" id="alert-box">
            <i className="alert-close fa fa-times" onClick={handleRemove}></i>
            <i className="fa fa-exclamation-circle p-1"></i>
            <span>{props.message}</span>
        </div>
    );
}