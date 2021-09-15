import {  ShipmentDTO } from "Types/DTO";
import { enumerateValidateMemberOnly, ValidateResultBad, ValidationResultOK } from "./Validation";

export class ShipmentDTOValidation implements ValidateMember<ShipmentDTO>{
    private readonly data: ShipmentDTO;
    constructor(shipment: ShipmentDTO) {
        this.data = shipment;
    }
    IsAllValid():IValidateResultOK|IValidateResultBad {
        return enumerateValidateMemberOnly<ShipmentDTO,ShipmentDTOValidation>(this);
    }
    IsCaretSizeValid() {
        const isValid = this.data.CaretSize !== 0;
        return isValid ? new ValidationResultOK() : new ValidateResultBad("Caret Size Cannot Be 0");
    }
    IsFlavourIdValid() {
        const isValid = this.data.FlavourId != -1;
        return isValid ? new ValidationResultOK() : new ValidateResultBad("Cannot be left Empty");
    }
    IsProductIdValid() {
        const isValid = this.data.ProductId != -1;
        return isValid ? new ValidationResultOK() : new ValidateResultBad("Cannot Be Empty");
    }
    IsIdValid() {
        const isValid = !this.data.Id;
        return isValid ? new ValidationResultOK() : new ValidateResultBad('Cannot be empty or 0');
    }
    IsTotalDefectedPiecesValid() {
        const isValid = this.data.TotalDefectedPieces >= this.data.TotalRecievedPieces;
        return isValid ? new ValidationResultOK() : new ValidateResultBad('Cannot Be Greater than ');
    }
    IsTotalRecievedPiecesValid() {
        if (!this.data.TotalRecievedPieces)
            return new ValidateResultBad('Cannot be empty');
        return new ValidationResultOK();
    }

}