import { ChangeEvent, useState } from 'react';
import { Scheme } from 'Types/DTO';

type VariableSectionProps = {
	handleSelection: (Id: number) => void;
	SchemeList: Scheme[];
};
const SchemeList = function (props: VariableSectionProps) {
	const [schemeSelected, setSchemeSelected] = useState<number>(-1);
	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const selectedScheme = Number.parseInt(e.currentTarget.value);
		setSchemeSelected(selectedScheme);
		props.handleSelection(selectedScheme);
	};
	return (
		<div className='variable-scheme-section form-group'>
			<small>Please Select a Scheme : </small>
			<select name='SchemeId' className="form-control-sm" onChange={handleChange} value={schemeSelected}>
				<option disabled value="-1">
					-- Select A Scheme Type --
				</option>
				{props.SchemeList.map((value, index) => (
					<option value={value.Id} key={index}>{value.Title}</option>
				))}
			</select>
		</div>
	);
};

export default SchemeList;