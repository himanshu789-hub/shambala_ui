import React, { CSSProperties, Fragment, PropsWithChildren, ReactNode } from 'react';
import { RouteChildrenProps } from 'react-router';
import './Loader.css';

export enum CallStatus {
	EMPTY = 0,
	LOADING,
	LOADED,
	ERROR
}
interface LoaderProps {
	Size?: number;
	Status: number;
	Message?: string;
	Overlay?: boolean;
};
export interface ApiStatusInfo {
	Message?: string;
	Status: CallStatus;
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
const Loader:React.FunctionComponent<PropsWithChildren<LoaderProps>> = function (props: React.PropsWithChildren<LoaderProps>): JSX.Element {
	const { Size, Status, Overlay } = props;
	const LoaderProerties = { '--size': (Size ?? 50) + 'px' } as LoaderSizeProperty;
	const Message = props.Message ?? "Gathering Data . . .";
	if (Status == CallStatus.ERROR) return <Error msg={props.Message} />;
	else if (Status == CallStatus.EMPTY) return <React.Fragment></React.Fragment>;

	return (<Fragment>
		<div className={`loader-root`}>
			{props.children}
				<div className={`loader-wrapper ${CallStatus.LOADED == Status ? 'd-none' : (CallStatus.LOADING == Status ? `d-block ${Overlay && 'overlay'}` : 'd-none')}`}>
					<div className='loader-holder'>
						<div className='loader' style={LoaderProerties}></div>
						<label className='text-info font-weight-bold blink'>{Message}</label>
					</div>
				</div>
			</div>
	</Fragment>
	);
}
export default Loader;