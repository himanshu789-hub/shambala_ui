import { ShipmentDTO } from "Types/DTO";
import './Validation.d';
import { checkAllElementValidInCollection, ValidateResultBad, ValidationResultOK } from './Validation';
import { ShipmentDTOValidation } from "./ShipmentValidation";

export default class ShipmentCollectionValidation implements ValidateArray<ShipmentDTO>{
    private collection: ShipmentDTO[];
    constructor(data: ShipmentDTO[]) {
        this.collection = data;
    }
    IsAllValid() {
        return checkAllElementValidInCollection(this.collection, ShipmentDTOValidation);
    }

}