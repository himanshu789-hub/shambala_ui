import Loader, { CallStatus } from 'Components/Loader/Loader';
import IShopService from 'Contracts/services/IShopService';
import React, { ChangeEvent, MouseEvent, MouseEventHandler, useState } from 'react';
import ShopService from 'Services/ShopService';
import { Shop } from 'Types/DTO';
import './ShopSelector.css';

type ShopSelectorProps = {
	handleSelection(name: string, value: any): void;
};
export default function ShopSelector(props: ShopSelectorProps) {
	const [shopId, selectShop] = useState<number>(-1);
	const [shops, setShopList] = useState<Shop[]>([]);
	const [name, setName] = useState<string>('');
	const [showDropdown, setShouldDropdownDisplay] = useState<boolean>(false);
	const [APIStatus, setAPIStatus] = useState<number>(CallStatus.EMPTY);
	const ShopServiceHandler: IShopService = new ShopService();
	const handleChange = (e: MouseEvent<HTMLLabelElement>) => {
		setShouldDropdownDisplay(false);

		setAPIStatus(CallStatus.EMPTY);

		setName(e.currentTarget.dataset.name ?? '');
		props.handleSelection('ShopId', Number.parseInt(e.currentTarget.dataset.value as string));
	};

	return (
		<div className='form-group dropdown shop'>
			<input
				className='form-control'
				value={name}
				placeholder='Enter Shop Name'
				onChange={e => {
					const name = e.currentTarget.value;
					setAPIStatus(CallStatus.LOADING);
					setName(name);
					ShopServiceHandler.GetByName(name).then(res => {
						setShopList(res.data);
						setAPIStatus(CallStatus.LOADED);
					});
					setShouldDropdownDisplay(true);
				}}
			/>
			<div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
				<Loader Status={APIStatus} >
					<React.Fragment>{shops.map((value, index) => (
						<label data-value={value.Id} data-name={value.Name} className='dropdown-item' onClick={handleChange}>
							{value.Name}
						</label>
					))}</React.Fragment>
				</Loader>
			</div>

		</div>
	);
}
