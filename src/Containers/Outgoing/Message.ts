import { OutgoingStatusErrorCode } from "Enums/Enum";

export const OutgoingStatusMessage = function (status: OutgoingStatusErrorCode) {
    let msg = "";
    switch (status) {
        case OutgoingStatusErrorCode.DUPLICATE:
            msg = "There Exists A Duplicate Row.Please, Ensure To Fill Unique Row"; break;
        case OutgoingStatusErrorCode.OUT_OF_STOCK:
            msg = "Products Quantities Exceed"; break;
        case OutgoingStatusErrorCode.SCHEME_EXCEED:
            msg = "Scheme Product Quantity Exceed"; break;
        case OutgoingStatusErrorCode.SCHEME_QUANTITY_NOT_VALID:
            msg = "Scheme Quantity Calculation Not Valid"; break;
        case OutgoingStatusErrorCode.CUSTOM_CARAT_PRICE_NOT_VALID:
            msg = "Custom Carat Quantity Excced Than Total Shiped Quantity"; break;
        case OutgoingStatusErrorCode.SHIPED_QUANTITY_NOT_VALID:
            msg = "Total Shiped Quantity Not Equal To Difference of Taken and Return"; break;
    }
    return msg;
}