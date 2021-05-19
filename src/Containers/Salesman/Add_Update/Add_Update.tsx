import { useParams } from "react-router";
import { Heading, IIdComponent, Spinner } from 'Components/Miscellaneous/Miscellaneous';
import React from "react";
import { SalesmanDTO } from "Types/DTO";
import ISalesmanService from "Contracts/services/ISalesmanService";
import { SalesmanService } from "Services/SalesmanService";


type ErrorMessage = {
    Name: string;
}
interface IProps {
    ShowSpinner: boolean;
    Salesman: SalesmanDTO;
    ErrorMessage: ErrorMessage;
}
interface Add_Update_Props extends IIdComponent {

}
interface Add_Update_State extends IProps {

}
interface IShowFormProps extends IProps {
    handleSubmit(): void;
    handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void;
}

function ShowForm(props: IShowFormProps) {
    const { handleChange, Salesman, ErrorMessage, handleSubmit } = props;
    return (<div className="Scheme">
        <Heading label="Add A Salesman" />
        <div className="container d-flex justify-content-center">
            <div className="col-5">
                <div className="form-group row">
                    <label htmlFor="inputName" className="col-sm-2 col-form-label">Name <Spinner show={props.ShowSpinner} />
                    </label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" value={Salesman.FullName}
                            onChange={handleChange}
                            name="FullName" id="inputName" placeholder="Salesman Full Name" />
                        <small className="text-danger">{ErrorMessage.Name}</small>
                    </div>
                </div>
                <div className="form-group row justify-content-center">
                    <button type="button" className="btn btn-outline-success col-10"
                        onClick={handleSubmit}>Submit</button>
                </div>
            </div>
            <div className="col-7">
                <img src="/salesman.svg" width="100%" />
            </div>
        </div>
    </div>);
}

export default class Salesman_Add_Update extends React.Component<Add_Update_Props, Add_Update_State>{
    salesmanService: ISalesmanService;
    constructor(props: Add_Update_Props) {
        super(props);
        this.state = {
            ErrorMessage: { Name: '' }, Salesman: { FullName: '', Id: 1 }, ShowSpinner: false
        }
        this.salesmanService = new SalesmanService();
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { currentTarget: { name, value } } = e;
        this.setState(({ Salesman }) => { return { Salesman: { ...Salesman, [name]: value } } });
    }
    IsAllValid = (): boolean => {
        let IsValid = true;
        const { Salesman: { FullName } } = this.state;
        const Error: ErrorMessage = { Name: '' };
        if (FullName.length == 0) {
            Error.Name = "Please Enter A Name";
            IsValid = false;
        }
        else
            Error.Name = '';
        return IsValid;
    }
    handleSubmit = () => {
        if (this.IsAllValid()) {
            const { Salesman } = this.state;
            const { history } = this.props;
            const { FullName, Id } = Salesman;
            const IsOnUpdate = this.props.Id != undefined;
            if (IsOnUpdate) {
                this.salesmanService.IsNameExists(FullName, Id)
                    .then(res => {
                        if (res.data)
                            this.setState(({ ErrorMessage }) => { return { ErrorMessage: { Name: "Name Already Exists" } } });
                        else
                            return this.salesmanService.Add(Salesman);
                    })
                    .then(() => history.push({ pathname: "/message/pass", search: "?message=Salesman Updated Successfully" }))
                    .catch(() => history.push({ pathname: "/message/fail" }));
            }
            else {
                this.salesmanService.Add(Salesman)
                    .then(() => history.push({ pathname: "/message/pass", search: "?message=Salesman Added Successfully" }))
                    .catch(() => history.push({ pathname: "/message/fail" }));
            }
        }
    }
    render() {
        return <ShowForm {...this.state} handleChange={this.handleChange} handleSubmit={this.handleSubmit} />;
    }
    componentDidMount() {
        const { Id } = this.props;
        if (Id != undefined)
            this.salesmanService.GetById(Id)
                .then(res => this.setState({ Salesman: res.data }))
                .catch(()=>this.props.history.push({pathname:"/message/fail"}));
    }
}