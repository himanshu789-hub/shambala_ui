import { ShipmentDTO } from "Types/DTO";
import { ValidateResult, ValidateMember } from './Validation';

type ShipmentValidate = ValidateMember<ShipmentDTO>;

export function ValidateShipment(data: ShipmentDTO): ShipmentValidate {

    return {
        IsCaretSizeValid: function () {
            const isValid = data.CaretSize != 0;
            return { IsValid: isValid, Message: isValid ? undefined : "Caret Size Cannot Be 0" };
        },
        IsFlavourIdValid: function () {
            const isValid = data.FlavourId != -1;
            return { IsValid: isValid, Message: isValid ? undefined : "Cannot be left Empty" }
        },
        IsProductIdValid: function () {
            const isValid = data.ProductId != -1;
            return { IsValid: isValid, Message: isValid ? undefined : "Cannot be left Empty" }
        },
        IsIdValid: function () {
            const isValid = !data.Id;
            return { IsValid: isValid, Message: isValid ? undefined : 'Cannot be empty or 0' }
        },
        IsTotalDefectedPiecesValid: function () {
            const isValid = data.TotalDefectedPieces >= data.TotalRecievedPieces;
            return { IsValid: isValid, Message: isValid ? undefined : "Cannot Exceed Provided Quantity" };
        },
        IsTotalRecievedPiecesValid: function () {
            if (!data.TotalRecievedPieces)
                return { IsValid: false, Message: 'Cannot Left Empty' }
            return { IsValid: true }
        }
    };
}