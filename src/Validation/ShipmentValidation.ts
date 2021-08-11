import { ShipmentDTO } from "Types/DTO";
import { ValidateMember, IValidateResultBad, IValidateResultOK } from './Validation.d';
type ShipmentValidate = ValidateMember<ShipmentDTO>;

export  class ValidateShipment implements ShipmentValidate {
    private data: ShipmentDTO;
    constructor(shipment: ShipmentDTO) {
        this.data = shipment;
    }
    IsCaretSizeValid() {

        const isValid = this.data.CaretSize != 0;
        return { IsValid: isValid, Message: isValid ? undefined : "Caret Size Cannot Be 0" };
    }
    IsFlavourIdValid() {
        const isValid = this.data.FlavourId != -1;
        return { IsValid: isValid, Message: isValid ? undefined : "Cannot be left Empty" }
    }
    IsProductIdValid() {
        const isValid = this.data.ProductId != -1;
        return { IsValid: isValid, Message: isValid ? undefined : "Cannot be left Empty" }
    }
    IsIdValid() {
        const isValid = !this.data.Id;
        return { IsValid: isValid, Message: isValid ? undefined : 'Cannot be empty or 0' }
    }
    IsTotalDefectedPiecesValid() {
        const isValid = this.data.TotalDefectedPieces >= this.data.TotalRecievedPieces;
        return { IsValid: isValid, Message: isValid ? undefined : "Cannot Exceed Provided Quantity" };
    }
    IsTotalRecievedPiecesValid() {
        if (!this.data.TotalRecievedPieces)
            return { IsValid: false, Message: 'Cannot Left Empty' }
        return { IsValid: true }
    }
}