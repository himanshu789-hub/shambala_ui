import * as GridParams from './../../../../Components/AgGridComponent/Grid.d';
import { CreditAndNetHolderDTO } from './../../../../Types/DTO.d';

type DataT = CreditAndNetHolderDTO;
type Ctx = undefined;

type CellRendererParams<V> = GridParams.GridRendererParams<V,DataT,Ctx>;
type ValueParserParams<V> = GridParams.GridValueParserParams<V,DataT,Ctx>;
type  ValueFormatterParams<V> = GridParams.GridValueFormatterParams<DataT,Ctx,V>;
type EditableParams  = GridParams.GridEditableCallbackParams<DataT>;