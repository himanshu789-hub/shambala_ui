import { SchemeType } from "Enums/Enum";
import { ChangeEvent } from "react";
import { Scheme } from "Types/DTO";

type DisplaySchemeProps = {
	ChoosenScheme: number;
	ShouldDisabledFixed:boolean;
	HandleChange: (name: string, value: any) => void;
}
const SchemeOptions = (props: DisplaySchemeProps) => {
	const { ChoosenScheme,ShouldDisabledFixed} = props;
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { HandleChange } = props;
		const { name, value } = e.currentTarget;
		HandleChange(name, Number.parseInt(value));
	}
	return (

		<div className={ChoosenScheme === -1 ? 'is-invalid' : ''}>
			<div className='form-inline'>
				<div className='form-check'>
					<input
						className='form-check-input'
						type='radio'
						name='ChoosenSchemeType'
						id='exampleRadios2'
						value={SchemeType.FIXED}
						checked={ChoosenScheme == SchemeType.FIXED}
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
						name='ChoosenSchemeType'
						id='exampleRadios3'
						checked={ChoosenScheme == SchemeType.VARIABLE || ShouldDisabledFixed}
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
						name='ChoosenSchemeType'
						id='exampleRadios4'
						onChange={handleChange}
						value={SchemeType.NONE}
						checked={ChoosenScheme == SchemeType.NONE}
					/>
					<label className='form-check-label' htmlFor='exampleRadios4'>
						NONE
			</label>
				</div>
			</div>
			<small className='invalid-feedback text-danger'>{ChoosenScheme == -1 ? 'Please Select A Scheme' : ''}</small>
		</div>

	);
}


export default SchemeOptions;