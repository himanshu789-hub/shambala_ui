import { ChangeEvent, useState } from 'react';
import { Scheme } from 'Types/DTO';

type VariableSectionProps = {
	handleSelection: (Id: number) => void;
	SchemeList: Scheme[];
};
const SchemeList = function (props: VariableSectionProps) {
	const [schemeSelected, setSchemeSelected] = useState<number>(0);
	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const selectedScheme = Number.parseInt(e.currentTarget.value);
		setSchemeSelected(selectedScheme);
		props.handleSelection(selectedScheme);
	};
	return (
		<div className='variable-scheme-section'>
			<select name='schemes' onChange={handleChange} value={schemeSelected}>
				<option selected disabled>
					-- Select A Scheme Type --
				</option>
				{props.SchemeList.map((value, index) => (
					<option value={value.Id} key={index}>{value.Name}</option>
				))}
			</select>
		</div>
	);
};

export default SchemeList;