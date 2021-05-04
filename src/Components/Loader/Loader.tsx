import React, { CSSProperties, Fragment } from 'react';
import './Loader.css';

export enum CallStatus {
	EMPTY = 0,
	LOADING,
	LOADED,
	ERROR
}
type LoaderProps = {
	Size?: number;
	children?: JSX.Element;
	Status: number;
	Message?: string;
};
export interface ApiStatusInfo  {
Message?:string;
Status:CallStatus;
}
interface LoaderSizeProperty extends CSSProperties {
	'--size': string;
}
function RequestError() {
	return <div className="sa">
		<div className="sa-warning">
			<div className="sa-warning-body"></div>
			<div className="sa-warning-dot"></div>
		</div>
	</div>;
}

function Error(props: { msg?: string }) {
	const Message = props.msg ?? "An Error Occured While Requesting Data";
	return <div className="d-flex flex-column justify-content-center align-items-center"><RequestError /><small className="text-center text-danger">{Message}</small></div>;
}
export default function Loader(props: LoaderProps) {
	const { Size, Status } = props;
	const LoaderProerties = { '--size': (Size ?? 50) + 'px' } as LoaderSizeProperty;
	const Message = props.Message ?? "Gathering Data . . .";
	if (Status == CallStatus.ERROR) return <Error msg={props.Message} />;
	else if (Status == CallStatus.EMPTY) return <React.Fragment></React.Fragment>;
	else if (Status === CallStatus.LOADING)
		return (
			<Fragment>
				<div className='loader-wrapper'>
					<div className='loader-holder'>
						<div className='loader' style={LoaderProerties}></div>

						<label className='text-info font-weight-bold blink'>{Message}</label>
					</div>
				</div>
			</Fragment>
		);
	else {
		return props.children ?? <></>;
	}
}
