import { AxiosResponse } from "axios";
import Loader, { ApiStatusInfo, CallStatus } from "Components/Loader/Loader";
import React from "react";

type FetchAPI<T> = (name: string) => Promise<AxiosResponse<T[]>>;
type FetchListProps<T extends {}> = {
    render(data: T[]): JSX.Element | JSX.Element[];
    fetchAllByName: FetchAPI<T>;
}
type FetchListState<T> = {
    data: T[];
    ErrorMsg: string;
    Name: string;
    FetchRequestInfo: ApiStatusInfo;
}
export default class FetchList<T> extends React.Component<FetchListProps<T>, FetchListState<T>>{
    constructor(props: FetchListProps<T>) {
        super(props);
        this.state = {
            data: [], ErrorMsg: '', Name: '', FetchRequestInfo: { Status: CallStatus.EMPTY, Message: '' }
        }
    }
    IsAllValid = () => {
        let IsAllValid = true;
        if (this.state.Name.length == 0) {
            this.setState({ ErrorMsg: "Please Enter Text To Search" });
            IsAllValid = false;
        }
        else
            this.setState({ ErrorMsg: '' });
        return IsAllValid;
    }

    handleSubmit = () => {
        if (this.IsAllValid()) {
            this.setState({ FetchRequestInfo: { Status: CallStatus.LOADING, Message: undefined } })
            this.props
                .fetchAllByName(this.state.Name)
                .then((res) => {
                    this.setState({ data: res.data, FetchRequestInfo: { Message: '', Status: CallStatus.LOADED } })
                })
        }
    }
    render() {
        const { FetchRequestInfo } = this.state;
        return <div>
            <div  className="form-inline justify-content-center align-items-start mb-4">
                <div className='d-flex flex-column col-5'>
                    <input name="Name" data-controlType="search" value={this.state.Name} placeholder="Enter Text To Search"
                        onChange={({ currentTarget: { value } }) => this.setState({ Name: value })} className="form-control" />
                    <small className='form-text  text-danger'>{this.state.ErrorMsg}</small>
                </div>
                <button type='button' className='btn btn-success' onClick={this.handleSubmit}>
                    Submit
                </button>
            </div>

            <Loader Status={FetchRequestInfo.Status} Message={FetchRequestInfo.Message}>
                <React.Fragment>{this.props.render(this.state.data)}</React.Fragment>
            </Loader>

        </div>
    }
}
