import SearchPanel from "Components/SearchPanel/SearchPanel";
import React from "react";
import ShopService from "Services/ShopService";
import { IShopBaseDTO } from "Types/DTO";

function ShopSelector(props: { handleSelection(Id: number): void }) {
	function FetchName(name: string) {
		return new ShopService().GetAllByName(name).then(res => res.data);
	}
	function HandleEnter(e: IShopBaseDTO) {
		debugger;
		props.handleSelection(e ? e.Id : -1);


	}

	return <SearchPanel<IShopBaseDTO> PlaceHolder="Enter Shop Name" DisplayFunction={e => <div>{e.Title}</div>}
		FetchPoint={FetchName} HandleEnter={HandleEnter} PropertyName={"Title"} />
}
export default ShopSelector;