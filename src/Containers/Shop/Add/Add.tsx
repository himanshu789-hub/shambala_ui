import { Heading } from 'Components/Miscellaneous/Miscellaneous';
import SchemeList from 'Components/SchemeList/SchmeList';
import React from 'react';
import { IShopDTO } from 'Types/DTO';
import { getARandomNumber } from 'Utilities/Utilities';

type AddProps = {

}
type ErrorMessage = {
    Name: string;
    Address: string;
}
type AddState = {
    Shop: IShopDTO;
    ErrorMessage: ErrorMessage
}
export default class Add extends React.Component<AddProps, AddState>
{
    constructor(props: AddProps) {
        super(props);
        this.state = {
            Shop: { Address: '', Id: getARandomNumber(), SchemeId: -1, Title: '' },
            ErrorMessage: { Address: '', Name: '' }
        }
    }
    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { currentTarget: { name, value } } = e;
        this.setState(({ Shop }) => { return { Shop: { ...Shop, [name]: value } } })
    }
    handleSelection=(Id: number) =>{
        this.setState(({ Shop }) => { return { Shop: { ...Shop, SchemeId: Id } } });
    }
    IsAllValid = (): boolean => {
        let IsAllValid = true;
        const { Shop } = this.state;
        const ErrorMessage: ErrorMessage = { Address: '', Name: '' };
        if (Shop.Title.length == 0)
            ErrorMessage.Name = "Please Enter A Name";
        else { ErrorMessage.Name = ''; IsAllValid = false; }
        if (Shop.Address.length == 0) {
            ErrorMessage.Address = "Please  Enter Address Detail";
            IsAllValid = false;
        }
        else
            ErrorMessage.Address = "";
        this.setState({ ErrorMessage: ErrorMessage });
        return IsAllValid;
    }
    handleSubmit = () => {
        if (this.IsAllValid()) {

        }
    }
    render() {
        const { Shop, ErrorMessage } = this.state;
        return (<div className="add">
            <Heading label="Add A Shop" />
            <div className="container row">
                <div className="col-5">
                    <div className="form-group row">
                        <label htmlFor="inputTitle" className="col-sm-2 col-form-label">Name</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" value={Shop.Title}
                                onChange={this.handleChange}
                                name="Title" id="inputTitle" placeholder="Shop Name" />
                            <small className="text-danger">{ErrorMessage.Name}</small>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="inputAddress" className="col-sm-2 col-form-label">Address</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" onChange={this.handleChange} id="inputAddress" name="Address" value={Shop.Address}
                                placeholder="Shop Address" />
                            <small className="text-danger">{ErrorMessage.Address}</small>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="inputScheme" className="col-sm-2 col-form-label">Scheme</label>
                        <div className="col-sm-10">
                            <div className="small-load">
                                <SchemeList SchemeId={Shop.SchemeId} handleSelection={this.handleSelection} />
                            </div>
                        </div>
                    </div>
                    <div className="form-group row justify-content-center">
                        <button type="button" disabled={Shop.SchemeId<-1} className="btn btn-outline-success col-10" onClick={this.handleSubmit}>Submit</button>
                    </div>
                </div>
                <div className="col-7">
                    <img src="/shop.svg" width="100%" />
                </div>
            </div>
        </div>);
    }
}