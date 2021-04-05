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
	Message?:string;
};
interface LoaderSizeProperty extends CSSProperties {
	'--size': string;
}
export default function Loader(props: LoaderProps) {
	const { Size, Status } = props;
	const LoaderProerties = { '--size': (Size ?? 50) + 'px' } as LoaderSizeProperty;
	const Message = props.Message??"Gathering Data . . .";
	if (Status==CallStatus.ERROR) return <div>An Error Occured While Requesting Data</div>;
	if (Status == CallStatus.EMPTY) return <React.Fragment></React.Fragment>;
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
