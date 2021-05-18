import Loader, { ApiStatusInfo, CallStatus } from 'Components/Loader/Loader';
import { ChangeEvent, useEffect, useState } from 'react';
import SchemeService from 'Services/SchemeService';
import { SchemeDTO } from 'Types/DTO';

type VariableSectionProps = {
	handleSelection: (Id: number) => void;
	SchemeId: number;
};
const SchemeList = function (props: VariableSectionProps) {
	const [schemeListRequestStatus, setSchemListRequestStatus] = useState<ApiStatusInfo>({ Status: CallStatus.EMPTY });
	const [SchemeList, setSchemeList] = useState<SchemeDTO[]>([]);
	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const selectedScheme = Number.parseInt(e.currentTarget.value);
		props.handleSelection(selectedScheme);
	};
	useEffect(() => {
		setSchemListRequestStatus({ Status: CallStatus.LOADING, Message: 'Gathering Schemes' });
		new SchemeService().GetAll()
			.then(res => {
				setSchemeList(res.data);
				setSchemListRequestStatus({ Status: CallStatus.LOADED, Message: undefined });
				props.handleSelection(-1);
			})
			.catch(() => { setSchemListRequestStatus({ Status: CallStatus.ERROR, Message: undefined }); props.handleSelection(-333)});
	}, []);
	return (
		<Loader Status={schemeListRequestStatus.Status} Message={schemeListRequestStatus.Message}>
			<div className='variable-scheme-section form-group'>
				<small>Select a Scheme : </small>
				<select name='SchemeId' className="form-control-sm" onChange={handleChange} value={props.SchemeId ?? -1}>
					<option value="-1">
						No Scheme
				</option>
					{SchemeList.map((value, index) => (
						<option value={value.Id} key={index}>{value.Title}</option>
					))}
				</select>
			</div>
		</Loader>
	);
};

export default SchemeList;