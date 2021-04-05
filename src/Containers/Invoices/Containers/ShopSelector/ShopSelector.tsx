import Loader, { CallStatus } from 'Components/Loader/Loader';
import IShopService from 'Contracts/Services/IShopService';
import { ChangeEvent, useState } from 'react';
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
	const handleChange = (e: ChangeEvent<HTMLOptionElement>) => {
		setShouldDropdownDisplay(false);
		setName(e.currentTarget.dataset.name ?? '');
		props.handleSelection('ShopId', Number.parseInt(e.currentTarget.value));
	};

	return (
		<div className='form-group'>
			<input
				className='form-control'
				value={name}
				onChange={e => {
					const name = e.currentTarget.value;
					setName(name);
					ShopServiceHandler.GetByName(name).then(res => setShopList(res.data));
					setShouldDropdownDisplay(true);
				}}
			/>
			<Loader Status={APIStatus} Size={24}>
				<div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
					{shops.map((value, index) => (
						<option value={value.Id} data-name={value.Name} className='dropdown-item' onChange={handleChange}>
							{value.Name}
						</option>
					))}
				</div>
			</Loader>
		</div>
	);
}
