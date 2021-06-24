import Loader, { CallStatus } from 'Components/Loader/Loader';
import IShopService from 'Contracts/services/IShopService';
import React, { ChangeEvent, MouseEvent, MouseEventHandler, useState } from 'react';
import ShopService from 'Services/ShopService';
import { IShopDTO } from 'Types/DTO';
import './ShopSelector.css';

type ShopSelectorProps = {
	handleSelection(Id: number): void;
};
const ShopSelector = function ShopSelector(props: ShopSelectorProps) {
	const [shops, setShopList] = useState<IShopDTO[]>([]);
	const [name, setName] = useState<string>('');
	const [showDropdown, setShouldDropdownDisplay] = useState<boolean>(false);
	const [APIStatus, setAPIStatus] = useState<number>(CallStatus.EMPTY);
	const ShopServiceHandler: IShopService = new ShopService();
	const handleSelect = (e: MouseEvent<HTMLLabelElement>) => {
		setShouldDropdownDisplay(false);
		setAPIStatus(CallStatus.EMPTY);

		setName(e.currentTarget.dataset.name ?? '');
		const ShopId = Number.parseInt(e.currentTarget.dataset.value as string);
		props.handleSelection(ShopId);
	};

	return (
		<div className='form-group shop dropdown'>
			<input
				className='form-control'
				value={name}
				data-toggle="dropdown"
				data-controlType="search"
				placeholder='Enter Shop Name'
				onChange={e => {
					const ShopName = e.currentTarget.value;
					setName(ShopName);
					setShouldDropdownDisplay(true);
					if (ShopName.length > 0)
						setAPIStatus(CallStatus.LOADING);
					ShopServiceHandler.GetAllByName(ShopName).then(res => {
						setShopList(res.data);
						setAPIStatus(CallStatus.LOADED);
					}).catch(() => setAPIStatus(CallStatus.ERROR));
				}}
			/>
			<div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
				<Loader Status={APIStatus} >
					<React.Fragment>{shops.map((value, index) => (
						<label data-value={value.Id} data-name={value.Title} key={value.Id} className='dropdown-item' onClick={handleSelect}>
							{value.Title}
						</label>
					))}</React.Fragment>
				</Loader>
			</div>

		</div>
	);
}
export default React.memo(ShopSelector);