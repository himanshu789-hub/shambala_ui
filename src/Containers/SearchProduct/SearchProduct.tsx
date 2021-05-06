import Loader, { ApiStatusInfo, CallStatus } from "Components/Loader/Loader";
import IProductService from "Contracts/services/IProductService";
import React from "react";
import ProductService from "Services/ProductService";
import { Flavour, Product, ProductInfo } from "Types/DTO";

function FlavourTable(props: { Flavours: Flavour[] }) {
    return (<table className="table-wrapper">
        <thead>
            <th>S.No.</th>
            <th>Flavour Name</th>
            <th>Quantity</th>
        </thead>
        <tbody>
            {props.Flavours.map((e, index) => <tr key={index}>
                <td>{index + 1}</td>
                <td>{e.Title}</td>
                <td>{e.Quantity}</td>
            </tr>)}
        </tbody>
    </table>);
}

type ViewAllProps = {

}
type ErrorMessgae = { ProductError: string, FlavourError: string };
type ViewAllState = {
    Products: Product[];
    SelectedProductId: number;
    ErrorMessage: ErrorMessgae;
    ProductInfos?: ProductInfo;
    ProductInfosRequestInfo: ApiStatusInfo;
    ProductRequestInfo: ApiStatusInfo;
}
export default class SearchProduct extends React.Component<ViewAllProps, ViewAllState>
{
    _productService: IProductService;
    constructor(props: ViewAllProps) {
        super(props);
        this.state = {
            Products: [], SelectedProductId: -1, ErrorMessage: { FlavourError: '', ProductError: '' },ProductInfosRequestInfo: { Status: CallStatus.EMPTY, Message: '' }, ProductRequestInfo: { Status: CallStatus.EMPTY, Message: '' }
        }
        this._productService = new ProductService();
    }
    handleSubmit = () => {
        if (this.IsAllValid()) {
            this.setState({ ProductInfosRequestInfo: { Status: CallStatus.LOADING, Message: "Fetching Result . . ." } });
            const {SelectedProductId} = this.state;
            this._productService.GetProductById(SelectedProductId)
                .then(res => this.setState({ ProductInfos: res.data, ProductInfosRequestInfo: { Status: CallStatus.LOADED, Message: undefined } }))
                .catch(() => this.setState({ ProductInfosRequestInfo: { Status: CallStatus.ERROR, Message: undefined } }));
        }
    }
    IsAllValid = () => {
        const { SelectedProductId } = this.state;
        let IsAllValid = true;
        let ErrorMessage: ErrorMessgae = { ProductError: '', FlavourError: '' };
        if (SelectedProductId == -1) {
            IsAllValid = false;
            ErrorMessage = { ...ErrorMessage, ProductError: 'Please Select A Product Name' };
        }
        else
            ErrorMessage = { ...ErrorMessage, ProductError: '' };
        // if (SelectedFlavourId == -1) {
        //     IsAllValid = false;
        //     ErrorMessage = { ...ErrorMessage, FlavourError: 'Please Select A Flavour' };
        // }
        // else
        //     ErrorMessage = { ...ErrorMessage, FlavourError: '' };
        this.setState({ ErrorMessage: ErrorMessage });
        return IsAllValid;
    }
    handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { currentTarget: { name, value } } = e;
        this.setState((prevState) => { return { ...prevState, [name]: value } });
    }
    render() {
        const { Products, ErrorMessage, SelectedProductId, ProductInfos, ProductInfosRequestInfo, ProductRequestInfo } = this.state;
        return (<div className="view-all">
            <h5 className="app-head">Search Product</h5>
            <Loader Message={ProductRequestInfo.Message} Status={ProductRequestInfo.Status}>
                <div className="form-inline justify-content-center">
                    <div className='d-flex flex-column'>
                        <div className='input-group mr-5'>
                            <div className='input-group-prepend'>
                                <div className='input-group-text'>Product Name</div>
                            </div>
                            <select name="SelectedProductId" onChange={this.handleChange} className="form-control" value={SelectedProductId}>
                                <option value="-1">-- Please Select A Product --</option>
                                {Products.map(e => <option value={e.Id}>{e.Name}</option>)}
                            </select>
                        </div>
                        <small className='form-text  text-danger'>{ErrorMessage.ProductError}</small>
                    </div>
                    
					<button type='submit' className='btn btn-success' onClick={this.handleSubmit}>
						Go
					</button>
                </div>
            </Loader>
            <Loader Message={ProductInfosRequestInfo.Message} Status={ProductInfosRequestInfo.Status}>
                {ProductInfos && <FlavourTable Flavours={ProductInfos.Flavours} />}
            </Loader>
        </div>);
    }
    componentDidMount() {
        this.setState({ ProductRequestInfo: { Status: CallStatus.LOADING, Message: "Fetching Products" } });
        this._productService.GetProductWithoutLimit()
            .then(res => this.setState({ Products: res.data, ProductRequestInfo: { Status: CallStatus.LOADED } }))
            .catch(() => this.setState({ ProductRequestInfo: { Status: CallStatus.ERROR, Message: undefined } }));
    }
}