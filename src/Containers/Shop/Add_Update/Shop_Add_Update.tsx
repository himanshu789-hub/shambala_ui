import { Heading, IIdComponent, Spinner } from 'Components/Miscellaneous/Miscellaneous';
import SchemeList from 'Components/SchemeList/SchmeList';
import React, { ComponentProps } from 'react';
import { IShopDTO } from 'Types/DTO';
import { getARandomNumber } from 'Utilities/Utilities';
import { RouteComponentProps, useParams, useRouteMatch } from 'react-router';
import ShopService from 'Services/ShopService';
import Loader, { ApiStatusInfo, CallStatus } from 'Components/Loader/Loader';


type ErrorMessage = {
    Name: string;
    Address: string;
}

type ShopFormProps = {
    Shop: IShopDTO;
    IsOnUpdate: boolean;
    ErrorMessage: ErrorMessage;
    ShouldDisableButton: boolean;
    handleChange(e: React.ChangeEvent<HTMLInputElement>): void;
    handleSelection(Id: number): void;
    handleSubmit(): void;
    ShowSpinner: boolean;
}
function ShopForm(props: ShopFormProps) {
    const { Shop, IsOnUpdate, handleChange, ErrorMessage, handleSelection, handleSubmit } = props;

    return (<div className="shop">
        <Heading label={IsOnUpdate ? "Update A Shop" : "Add A Shop"} />
        <div className="container d-flex justify-content-center">
            <div className="col-5">
                <div className="form-group row">
                    <label htmlFor="inputTitle" className="col-sm-2 col-form-label">Name <Spinner show={props.ShowSpinner} />
                    </label>
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
                    <label htmlFor="inputScheme" className="col-sm-2 col-form-label"></label>
                    <div className="col-sm-10">
                        <SchemeList SchemeId={Shop.SchemeId ?? -1} handleSelection={handleSelection} />
                    </div>
                </div>
                <div className="form-group row justify-content-center">
                    <button type="button" disabled={Shop.SchemeId! < -1} className="btn btn-outline-success col-10"
                        onClick={handleSubmit}>Submit</button>
                </div>
            </div>
            <div className="col-7">
                <img src="/shop.svg" width="100%" />
            </div>
        </div>
    </div>);
}
interface IAddProps extends IIdComponent {

}
type AddState = {
    Shop: IShopDTO;
    ErrorMessage: ErrorMessage;
    RequestInfo: ApiStatusInfo;
    ShowSpinner: boolean;
    ShouldDisableButton: boolean;
}

export default class Add_Update extends React.Component<IAddProps, AddState>
{
    shopService: ShopService;
    constructor(props: IAddProps) {
        super(props);
        this.state = {
            Shop: { Address: '', Id: getARandomNumber(), SchemeId: null, Title: '' },
            ErrorMessage: { Address: '', Name: '' },
            RequestInfo: { Status: CallStatus.EMPTY, Message: '' }, ShowSpinner: false, ShouldDisableButton: false
        }
        this.shopService = new ShopService();
    }
    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { currentTarget: { name, value } } = e;
        this.setState(({ Shop }) => { return { Shop: { ...Shop, [name]: value } } })
    }
    handleSelection = (Id: number) => {
        this.setState(({ Shop }) => { return { Shop: { ...Shop, SchemeId: Id <= -1 ? null : Id }, ShouldDisableButton: Id < -1 } });
    }
    IsAllValid = (): boolean => {
        let IsAllValid = true;
        const { Shop } = this.state;
        const ErrorMessage: ErrorMessage = { Address: '', Name: '' };
        if (Shop.Title.length == 0) {
            ErrorMessage.Name = "Please Enter A Name";

            IsAllValid = false;
        }
        else { ErrorMessage.Name = ''; }
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
            const { history } = this.props;
            const { Shop } = this.state;
            this.setState({ ShowSpinner: true })
            const IsOnUpdate = this.props.Id != undefined;
            
            if (IsOnUpdate)
                this.shopService.IsNameExists(Shop.Title,Shop.Id).
                    then((res) => {
                        this.setState({ ShowSpinner: false });
                        if (!res.data)
                            return this.shopService.Update(Shop)
                        else
                            this.setState({ ErrorMessage: { Name: "Name Already Exists", Address: '' } });
                    })
                    .then((res) => history.push({ pathname: "/message/pass", search: "?message=Shop Updated Added" }))
                    .catch(() => history.push({ pathname: "/message/fail" }));
            else
                this.shopService.IsNameExists(Shop.Title)
                    .then(res => {
                        if (!res.data)
                            return this.shopService.Add(Shop)
                        else
                            this.setState({ ErrorMessage: { Name: "Name Already Exists", Address: "" } });
                    })
                    .then(() => history.push({ pathname: "/message/pass", search: "?message=New Shop Added" }))
                    .catch(() => history.push({ pathname: "/message/fail" }));
        }
    }

    render() {
        const { Shop, ErrorMessage, RequestInfo } = this.state;
        const { Id: ShopId } = this.props;
        const IsOnUpdate = ShopId != undefined;
        // if DisplayShopForm is with a function invocation inside, it will be re-declared.Same in case of HOC evaluation
        const DisplayShopForm = <ShopForm ShowSpinner={this.state.ShowSpinner} handleSubmit={this.handleSubmit}
            handleSelection={this.handleSelection} handleChange={this.handleChange}
            ErrorMessage={ErrorMessage} Shop={Shop} IsOnUpdate={IsOnUpdate} ShouldDisableButton={this.state.ShouldDisableButton} />

        if (IsOnUpdate)
            return (<Loader Status={RequestInfo.Status} Message={RequestInfo.Message}>
                <React.Fragment>{DisplayShopForm}</React.Fragment>
            </Loader>);
        return <React.Fragment>{DisplayShopForm}</React.Fragment>;
    }
    componentDidMount() {
        const { Id: ShopId } = this.props;
        if (ShopId) {
            this.setState({ RequestInfo: { Status: CallStatus.LOADING, Message: 'Fetching Shop Info' } });
            this.shopService.GetById(ShopId)
                .then((res) => this.setState({ RequestInfo: { Message: '', Status: CallStatus.LOADED }, Shop: res.data }))
                .catch(() => this.setState({ RequestInfo: { Status: CallStatus.ERROR, Message: undefined } }));
        }
    }
}