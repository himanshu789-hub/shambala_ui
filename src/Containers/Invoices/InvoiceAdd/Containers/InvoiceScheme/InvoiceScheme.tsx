import Loader, { CallStatus } from 'Components/Loader/Loader';
import ISchemeService from 'Contracts/Services/ISchemeService';
import { SchemeType } from 'Enums/Enum';
import React, { ChangeEvent, useState } from 'react';
import SchemeService from 'Services/SchemeService';
import { Scheme } from 'Types/DTO';

type VariableSectionProps = {
	handleSelection: (Id: number) => void;
	SchemeList: Scheme[];
};
const VariableSection = function (props: VariableSectionProps) {
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
					<option value={value.Id}>{value.Name}</option>
				))}
			</select>
		</div>
	);
};

type InvoiceSchemeProps = {
	ShopId: number | undefined;
	handleSchemeSelection: (name: string, value: any) => void;
};
type InvoiceSchemeState = {
	SchemeList: Scheme[];
	SelectedScheme?: Scheme;
	APIStatus: number;
	APIMessage: string | undefined;
	ChoosenScheme: number;
	ChoosenSchemeType: number;
};

export default class InvoiceScheme extends React.Component<InvoiceSchemeProps, InvoiceSchemeState> {
	_schemeService: ISchemeService;
	constructor(props: InvoiceSchemeProps) {
		super(props);
		this.state = {
			SchemeList: [],
			APIStatus: CallStatus.LOADING,
			ChoosenScheme: -1,
			APIMessage: 'Gethering Selected Shop Scheme',
			ChoosenSchemeType: -1,
		};
		this._schemeService = new SchemeService();
	}
	handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const {
			currentTarget: { name, value },
		} = e;
		let Value: any;
		switch (name) {
			case 'ChoosenSchemeType':
				const scheme = Number.parseInt(value);
				if (scheme === SchemeType.FIXED)
					this.setState(({ SelectedScheme }) => {
						return { ChoosenScheme: (SelectedScheme as Scheme).Id };
					});
				this.setState({ ChoosenSchemeType: scheme });
				break;
			default:
				break;
		}
	};
	handleSelection = (Id: number) => {
		this.setState({ ChoosenScheme: Id });
		this.props.handleSchemeSelection('SchemeId', Id);
	};
	render() {
		const { APIStatus, APIMessage, SelectedScheme, SchemeList, ChoosenScheme, ChoosenSchemeType } = this.state;
		if (this.props.ShopId == -1) return <small className='form-text text-danger'>Shop not Selected</small>;
		return (
			<Loader Status={APIStatus} Message={APIMessage}>
				<div>
					<div className={ChoosenScheme === -1 ? 'is-invalid' : ''}>
						<div className='form-inline'>
							<div className='form-check'>
								<input
									className='form-check-input'
									type='radio'
									name='ChoosenSchemeType'
									id='exampleRadios2'
									value={SchemeType.FIXED}
									disabled={!SelectedScheme}
									onChange={this.handleChange}
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
									onChange={this.handleChange}
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
									id='exampleRadios3'
									onChange={this.handleChange}
									value={SchemeType.NONE}
								/>
								<label className='form-check-label' htmlFor='exampleRadios3'>
									NONE
								</label>
							</div>
						</div>
						<small className='invalid-feedback text-danger'>{ChoosenScheme == -1 ? 'Please Select A Scheme' : ''}</small>
					</div>
					{ChoosenSchemeType === SchemeType.VARIABLE && (
						<VariableSection SchemeList={SchemeList} handleSelection={this.handleSelection} />
					)}
				</div>
			</Loader>
		);
	}
	componentDidMount() {
		const { ShopId } = this.props;
		if (ShopId) {
			
			this._schemeService
				.GetByShopId(ShopId)
				.then(res => {
					const choosenSchemeType = res.data ? SchemeType.FIXED : SchemeType.VARIABLE;
					this.setState({ SelectedScheme: res.data, APIMessage: 'Gathering All Scheme', ChoosenSchemeType: choosenSchemeType });
					if (choosenSchemeType) this.props.handleSchemeSelection('SchemeId', res.data.Id);
				})
				.catch(e => this.setState({ APIStatus: CallStatus.ERROR }));
			this._schemeService
				.GetAll()
				.then(res => this.setState({ SchemeList: res.data, APIMessage: undefined, APIStatus: CallStatus.LOADED }))
				.catch(e => this.setState({ APIStatus: CallStatus.ERROR }));
			
		}
	}
}
