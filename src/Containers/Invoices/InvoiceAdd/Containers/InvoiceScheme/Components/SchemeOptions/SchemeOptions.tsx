import { SchemeType } from "Enums/Enum";
import React, { ChangeEvent, useEffect } from "react";

type DisplaySchemeProps = {
	ChoosenSchemeEnumType: number;
	ShouldDisabledFixed: boolean;
	HandleChange: (name: string, value: any) => void;
}
const SchemeOptions = class SchemeOptions extends React.Component<DisplaySchemeProps, {}> {
	constructor(props: DisplaySchemeProps) {
		super(props);
	}
	componentWillMount() {
		console.log("Mounted");
	}
	componentWillUnmount() {
		console.log("Unmounted Scheme Options");
	}
	render() {
		const { ChoosenSchemeEnumType, ShouldDisabledFixed } = this.props;
		const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
			const { HandleChange } = this.props;
			const {  value } = e.currentTarget;
			HandleChange('ChoosenSchemeType', Number.parseInt(value));
		}
		const name = 'ChoosenSchemeType' + Math.random();
		return (

			<div className={ChoosenSchemeEnumType === -1 ? 'is-invalid' : ''}>
				<div className='form-inline'>
					<div className='form-check'>
						<input
							className='form-check-input'
							type='radio'
							name={name}
							id='exampleRadios2'
							value={SchemeType.FIXED}
							checked={ChoosenSchemeEnumType === SchemeType.FIXED}
							disabled={ShouldDisabledFixed}
							onChange={handleChange}
						/>
						<label className='form-check-label' htmlFor='exampleRadios2'>
							FIXED
			</label>
					</div>
					<div className='form-check ml-2 mr-2'>
						<input
							className='form-check-input'
							type='radio'
							name={name}
							id='exampleRadios3'
							checked={ChoosenSchemeEnumType === SchemeType.VARIABLE}
							onChange={handleChange}
							value={SchemeType.VARIABLE}
						/>
						<label className='form-check-label' htmlFor='exampleRadios3'>
							VARIABLE
			</label>
					</div>
					<div className='form-check'>
						<input
							className='form-check-input'
							type='radio'
							name={name}
							id='exampleRadios4'
							onChange={handleChange}
							value={SchemeType.NONE}
							checked={ChoosenSchemeEnumType === SchemeType.NONE}

						/>
						<label className='form-check-label' htmlFor='exampleRadios4'>
							NONE
			</label>
					</div>
				</div>
				<small className='invalid-feedback text-danger'>{ChoosenSchemeEnumType == -1 ? 'Please Select A Scheme Type' : ''}</small>
			</div>

		);
	}

}


export default SchemeOptions;