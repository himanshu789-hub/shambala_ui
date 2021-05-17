import { Heading } from 'Components/Miscellaneous/Miscellaneous';
import SchemeList from 'Components/SchemeList/SchmeList';
import React from 'react';
import { IShopDTO } from 'Types/DTO';
import { getARandomNumber } from 'Utilities/Utilities';
import { RouteComponentProps, useRouteMatch } from 'react-router';
import ShopService from 'Services/ShopService';
import Loader, { ApiStatusInfo, CallStatus } from 'Components/Loader/Loader';


export default function Shop_Add_Update(props: RouteComponentProps) {
    const match = useRouteMatch<{ id?: string }>();
    const { params: { id } } = match;
    if (!id)
        return <Add_Update  {...props} />
    if (Number.parseInt(id)) {
        return <Add_Update  {...props} ShopId={Number.parseInt(id)} />
    }
    else
        return <div className="alert alter-danger">Invalid Route</div>;
}

type ErrorMessage = {
    Name: string;
    Address: string;
}

type ShopFormProps = {
    Shop: IShopDTO;
    IsOnUpdate: boolean;
    ErrorMessage: ErrorMessage;
    handleChange(e: React.ChangeEvent<HTMLInputElement>): void;
    handleSelection(Id: number): void;
    handleSubmit(): void;
}
function ShopForm(props: ShopFormProps) {
    const { Shop, IsOnUpdate, handleChange, ErrorMessage, handleSelection, handleSubmit } = props;

    return (<div className="shop">
        <Heading label={IsOnUpdate ? "Update A Shop" : "Add A Shop"} />
        <div className="container row">
            <div className="col-5">
                <div className="form-group row">
                    <label htmlFor="inputTitle" className="col-sm-2 col-form-label">Name</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" value={Shop.Title}
                            onChange={handleChange}
                            name="Title" id="inputTitle" placeholder="Shop Name" />
                        <small className="text-danger">{ErrorMessage.Name}</small>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="inputAddress" className="col-sm-2 col-form-label">Address</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" onChange={handleChange} id="inputAddress" name="Address" value={Shop.Address}
                            placeholder="Shop Address" />
                        <small className="text-danger">{ErrorMessage.Address}</small>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="inputScheme" className="col-sm-2 col-form-label">Scheme</label>
                    <div className="col-sm-10">
                        <div className="small-load">
                            <SchemeList SchemeId={Shop.SchemeId} handleSelection={handleSelection} />
                        </div>
                    </div>
                </div>
                <div className="form-group row justify-content-center">
                    <button type="button" disabled={Shop.SchemeId < -1} className="btn btn-outline-success col-10" onClick={handleSubmit}>Submit</button>
                </div>
            </div>
            <div className="col-7">
                <img src="/shop.svg" width="100%" />
            </div>
        </div>
    </div>);
}
interface IAddProps extends RouteComponentProps {
    ShopId?: number;
}
type AddState = {
    Shop: IShopDTO;
    ErrorMessage: ErrorMessage;
    RequestInfo: ApiStatusInfo;
}

class Add_Update extends React.Component<IAddProps, AddState>
{
    shopService: ShopService;
    constructor(props: IAddProps) {
        super(props);
        this.state = {
            Shop: { Address: '', Id: getARandomNumber(), SchemeId: -1, Title: '' },
            ErrorMessage: { Address: '', Name: '' },
            RequestInfo: { Status: CallStatus.EMPTY, Message: '' }
        }
        this.shopService = new ShopService();
    }
    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { currentTarget: { name, value } } = e;
        this.setState(({ Shop }) => { return { Shop: { ...Shop, [name]: value } } })
    }
    handleSelection = (Id: number) => {
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
        const { Shop, ErrorMessage, RequestInfo } = this.state;
        const { ShopId } = this.props;
        const IsOnUpdate = ShopId != undefined;
        // if DisplayShopForm is with a function invocation inside, it will be re-declared.Same in case of HOC evaluation
        const DisplayShopForm = <ShopForm handleSubmit={this.handleSubmit}
            handleSelection={this.handleSelection} handleChange={this.handleChange}
            ErrorMessage={ErrorMessage} Shop={Shop} IsOnUpdate={IsOnUpdate} />

        if (IsOnUpdate)
            return <Loader Status={RequestInfo.Status} Message={RequestInfo.Message}>
                {DisplayShopForm}
            </Loader>
        return { DisplayShopForm };
    }
    componentDidMount() {
        const { ShopId } = this.props;
        if (ShopId) {
            this.setState({ RequestInfo: { Status: CallStatus.LOADING, Message: 'Fetching Shop Info' } });
            this.shopService.GetById(ShopId)
                .then((res) => this.setState({ RequestInfo: { Message: '', Status: CallStatus.LOADED }, Shop: res.data }))
                .catch(() => this.setState({ RequestInfo: { Status: CallStatus.ERROR, Message: undefined } }));
        }
    }
}