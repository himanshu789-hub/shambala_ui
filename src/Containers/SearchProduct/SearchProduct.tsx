import Loader, { ApiStatusInfo, CallStatus } from "Components/Loader/Loader";
import IProductService from "Contracts/services/IProductService";
import React from "react";
import ProductService from "Services/ProductService";
import { FlavourInfo, Product, ProductInfo } from "Types/DTO";
import { getQuantityInText } from 'Utilities/Utilities';
function FlavourTable(props: { Flavours: FlavourInfo[], CaretSize: number }) {
    return (
        <div className="table-wrapper">
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>S.No.</th>
                        <th>Flavour Name</th>
                        <th>Quantity In Stock</th>
                        <th>Quantity In Dispatch</th>
                    </tr>
                </thead>
                <tbody>
                    {props.Flavours.map((e, index) => <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{e.Title}</td>
                        <td>{getQuantityInText(e.QuantityInStock, props.CaretSize)}</td>
                        <td className={e.QuantityInDispatch!=0?'bg-warning text-white':''}>{e.QuantityInDispatch==0?'---':getQuantityInText(e.QuantityInDispatch, props.CaretSize)}</td>
                    </tr>)}
                </tbody>
            </table></div>);
}

type ProductSearchProps = {

}
type ErrorMessgae = { ProductError: string, FlavourError: string };
type ProductSearchState = {
    Products: Product[];
    SelectedProductId: number;
    ErrorMessage: ErrorMessgae;
    ProductInfos?: ProductInfo;
    ProductInfosRequestInfo: ApiStatusInfo;
    ProductRequestInfo: ApiStatusInfo;
}
export default class SearchProduct extends React.Component<ProductSearchProps, ProductSearchState>
{
    _productService: IProductService;
    constructor(props: ProductSearchProps) {
        super(props);
        this.state = {
            Products: [], SelectedProductId: -1, ErrorMessage: { FlavourError: '', ProductError: '' }, ProductInfosRequestInfo: { Status: CallStatus.EMPTY, Message: '' }, ProductRequestInfo: { Status: CallStatus.EMPTY, Message: '' }
        }
        this._productService = new ProductService();
    }
    handleSubmit = () => {
        if (this.IsAllValid()) {
            this.setState({ ProductInfosRequestInfo: { Status: CallStatus.LOADING, Message: "Fetching Result . . ." } });
            const { SelectedProductId } = this.state;
            this._productService.GetProductById(SelectedProductId)
                .then(res => {
                    debugger;
                    this.setState({ ProductInfos: res.data, ProductInfosRequestInfo: { Status: CallStatus.LOADED, Message: undefined } });
                })
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
                <div className="form-inline justify-content-center align-items-center">
                    <div className='d-flex flex-column'>
                        <div className={`input-group mr-5 ${ErrorMessage.ProductError.length > 0 && 'is-invalid'}`}>
                            <div className='input-group-prepend'>
                                <div className='input-group-text'>Product Name</div>
                            </div>
                            <select name="SelectedProductId" onChange={this.handleChange} className="form-control" value={SelectedProductId}>
                                <option value="-1" disabled>-- Please Select A Product --</option>
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
                {ProductInfos && <div className="mt-2"><FlavourTable Flavours={ProductInfos.FlavourInfos} CaretSize={ProductInfos.CaretSize} /></div>}
            </Loader>
        </div>);
    }
    componentDidMount() {
        this.setState({ ProductRequestInfo: { Status: CallStatus.LOADING, Message: "Fetching Products" } });
        this._productService.GetAll()
            .then(res => this.setState({ Products: res.data, ProductRequestInfo: { Status: CallStatus.LOADED } }))
            .catch(() => this.setState({ ProductRequestInfo: { Status: CallStatus.ERROR, Message: undefined } }));
    }
}