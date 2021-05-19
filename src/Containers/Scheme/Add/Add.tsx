import { Heading, Spinner } from 'Components/Miscellaneous/Miscellaneous';
import { SchemeKey, SchemeType } from 'Enums/Enum';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import SchemeService from 'Services/SchemeService';
import { SchemeDTO } from 'Types/DTO';

type ErrorMessage = {
    Name: string;
    Value: string;
}
interface IProps {
    ShowSpinner: boolean;
    Scheme: SchemeDTO;
    ErrorMessage: ErrorMessage;
}
interface IShowFormProps extends IProps {
    handleSubmit(): void;
    handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void;
}
function ShowForm(props: IShowFormProps) {
    const { handleChange, Scheme, ErrorMessage, handleSubmit } = props;
    return (<div className="Scheme">
        <Heading label="Add A Scheme" />
        <div className="container d-flex justify-content-center">
            <div className="col-5">
                <div className="form-group row">
                    <label htmlFor="inputTitle" className="col-sm-2 col-form-label">Name <Spinner show={props.ShowSpinner} />
                    </label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" value={Scheme.Title}
                            onChange={handleChange}
                            name="Title" id="inputTitle" placeholder="Scheme Name" />
                        <small className="text-danger">{ErrorMessage.Name}</small>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="inputSchmeType" className="col-sm-2 col-form-label">Type
                    </label>
                    <div className="col-sm-10">
                        <select name="SchemeType" className="form-control" value={Scheme.SchemeType} onChange={handleChange} id="inputSchemeType">
                            {Object.entries(SchemeKey).map(({ "0": name, "1": value }) => <option value={value} key={name}>{name}</option>).splice(Object.keys(SchemeKey).length / 2)}
                        </select>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Defined By
                    </label>
                    <div className="col-sm-10 d-inline-flex justify-content-around" >
                        <div className="form-check">
                            <input className="form-check-input" onChange={handleChange} type="radio" name="IsUserDefinedScheme" checked={!Scheme.IsUserDefinedScheme} value="0" id="defaultCheck1" />
                            <label className="form-check-label" htmlFor="defaultCheck1">
                                Company
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" onChange={handleChange} type="radio" value="1" name="IsUserDefinedScheme" checked={Scheme.IsUserDefinedScheme} id="defaultCheck2" />
                            <label className="form-check-label" htmlFor="defaultCheck2" >
                                Our Firm
                            </label>
                        </div>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="inputValue" className="col-sm-2 col-form-label">Quota</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control"  onChange={handleChange} id="inputAddress" name="Value" value={Scheme.Value}
                            placeholder="Scheme Quota" />
                        <small className="text-danger">{ErrorMessage.Value}</small>
                    </div>
                </div>
                <div className="form-group row justify-content-center">
                    <button type="button" className="btn btn-outline-success col-10"
                        onClick={handleSubmit}>Submit</button>
                </div>
            </div>
            <div className="col-7">
                <img src="/discount.svg" width="100%" />
            </div>
        </div>
    </div>);
}
interface ISchemeAddProps extends RouteComponentProps {

}
interface ISchemeState extends IProps {

}
export default class SchemeAdd extends React.Component<ISchemeAddProps, ISchemeState>{

    schemeService: SchemeService;
    constructor(props: ISchemeAddProps) {
        super(props);
        this.state = {
            ErrorMessage: { Name: '', Value: '' },
            Scheme: { Date: new Date().toJSON(), Id: 782, IsUserDefinedScheme: true, SchemeType: SchemeKey.PERCENTAGE, Title: '', Value: 0 },
            ShowSpinner: false
        }
        this.schemeService = new SchemeService();
    }
    provideValidValue = (name: string, input: string): any => {
        const { Scheme: { Value, SchemeType } } = this.state;
        let Result: any = input;
        if (name == "Value") {
            if ((SchemeType === SchemeKey.PERCENTAGE && input.search(/[\D ]/) != -1) || (input.search(/[\D ]/) != -1)) {
                Result = Value;
            }
            else Result = Number.parseInt(Result);
        }
        else if (name === "IsUserDefinedScheme")
            Result = input == "1";
        return Result;
    }
    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { currentTarget: { name, value } } = e
        let Value: any = this.provideValidValue(name, value);
        this.setState(({ Scheme }) => { return { Scheme: { ...Scheme, [name]: Value } } });
    }

    IsValueValid = (): { result: boolean, msg: string } => {
        const { Scheme: { Value, SchemeType } } = this.state;
        let IsValueValid = true;
        let msg = '';
        if (SchemeType == SchemeKey.PERCENTAGE) {
            if (Value > 100) {
                msg = "Value Must Be Less Than 100";
                IsValueValid = false;
            }
        }
        return { result: IsValueValid, msg };
    }
    IsAllValid = (): boolean => {
        const { Scheme } = this.state;
        let IsAllValid = true;
        const Error: ErrorMessage = this.state.ErrorMessage;
        if (Scheme.Title.length == 0) {
            IsAllValid = false;
            Error.Name = "Please Enter A Scheme Name";
        }
        else Error.Name = '';
        const ValueIsValidResult = this.IsValueValid();
        if (!ValueIsValidResult.result)
            IsAllValid = false;
        Error.Value = ValueIsValidResult.msg;

        this.setState({ ErrorMessage: Error });
        return IsAllValid;
    }
    handleSubmit = () => {
        if (this.IsAllValid()) {
            const { Scheme } = this.state;
            const { history } = this.props;
            this.schemeService.Add(Scheme)
                .then(res => history.push({ pathname: "/message/pass", search: "?message=Added Sucesffuly" }))
                .catch(() => history.push({ pathname: "/message/fail" }));
        }
    }
    render() {
        const { ErrorMessage, ShowSpinner, Scheme } = this.state;
        return <ShowForm handleSubmit={this.handleSubmit} ErrorMessage={ErrorMessage}
            Scheme={Scheme} ShowSpinner={ShowSpinner} handleChange={this.handleChange} />;
    }
}