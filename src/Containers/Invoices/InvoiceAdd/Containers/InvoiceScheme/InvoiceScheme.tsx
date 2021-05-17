import Loader, { CallStatus } from 'Components/Loader/Loader';
import ISchemeService from 'Contracts/services/ISchemeService';
import { SchemeType } from 'Enums/Enum';
import { log } from 'node:console';
import React, { ChangeEvent, Fragment, useEffect, useState } from 'react';
import SchemeService from 'Services/SchemeService';
import { Scheme } from 'Types/DTO';
import SchemeList from '../../../../../Components/SchemeList/SchmeList';
import SchemeOptions from './Components/SchemeOptions/SchemeOptions';
type InvoiceSchemeProps = {
	ShopId: number | undefined;
	handleSchemeSelection: (name: string, value: any) => void;
};
type InvoiceSchemeState = {
	SelectedScheme?: Scheme;
	APIStatus: number;
	APIMessage: string | undefined;
	ChoosenSchemeId: number;
	ChoosenSchemeEnumType: number;
};

export default class InvoiceScheme extends React.PureComponent<InvoiceSchemeProps, InvoiceSchemeState> {
	_schemeService: ISchemeService;
	constructor(props: InvoiceSchemeProps) {
		super(props);
		this.state = {
			APIStatus: CallStatus.LOADING,
			ChoosenSchemeId: -1,
			APIMessage: 'Gethering Selected Shop Scheme',
			ChoosenSchemeEnumType: -1,
		};
		this._schemeService = new SchemeService();
	}
	handleChange = (name: string, value: any) => {
		switch (name) {
			case 'ChoosenSchemeType':
				const schemeenumtype = value;

				if (schemeenumtype === SchemeType.FIXED) {
					this.handleSelection((this.state.SelectedScheme as Scheme).Id);
				}
				else {
					this.handleSelection(-1);
				}
				this.setState({ ChoosenSchemeEnumType: schemeenumtype });
				break;
			default:
				break;
		}
	};
	handleSelection = (Id: number) => {
		this.setState({ ChoosenSchemeId: Id });
		this.props.handleSchemeSelection('SchemeId', Id);
	};
	render() {
		const { APIStatus, APIMessage, SelectedScheme, ChoosenSchemeId: ChoosenScheme, ChoosenSchemeEnumType: ChoosenSchemeType } = this.state;
		if (this.props.ShopId == -1) return <small className='form-text text-danger'>Shop not Selected</small>;
		return (
			<Loader Status={APIStatus} Message={APIMessage}>
				<React.Fragment>
					<SchemeOptions ChoosenSchemeEnumType={ChoosenSchemeType} 
						HandleChange={this.handleChange}
						ShouldDisabledFixed={!SelectedScheme} />
					{
						ChoosenSchemeType === SchemeType.VARIABLE && (
							<SchemeList SchemeId={ChoosenScheme} handleSelection={this.handleSelection} />
						)
					}
				</React.Fragment>
			</Loader >
		);
	}
	componentDidMount() {
		const { ShopId } = this.props;
		if (ShopId) {

			this._schemeService
				.GetByShopId(ShopId)
				.then(res => {
					const choosenSchemeType = res.data ? SchemeType.FIXED : SchemeType.VARIABLE;
					this.setState({ SelectedScheme: res.data,APIStatus:CallStatus.LOADED,ChoosenSchemeId:res.data.Id??-1, APIMessage: undefined, ChoosenSchemeEnumType: choosenSchemeType });
					if (choosenSchemeType==SchemeType.FIXED)
						this.props.handleSchemeSelection('SchemeId', res.data.Id);
				})
				.catch(e => this.setState({ APIStatus: CallStatus.ERROR,APIMessage:undefined }));
		}
	}
}
