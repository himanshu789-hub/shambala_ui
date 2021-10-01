import { OutgoingStatusErrorCode } from "Enums/Enum";
import { OutgoingGridColName, OutgoingUpdateRow } from './Add_Update/OutgoingGrid.d';

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

export function getColumnName(name: OutgoingGridColName) {
    let columnName = '';
    switch (name) {
        case 'CaretSize':
            columnName = "Carat Size"; break;
        case 'ProductId':
            columnName = "Product"; break;
        case 'FlavourId':
            columnName = "Flavour"; break;
        case 'NetPrice':
            columnName = "Net Price"; break;
        case 'SchemeQuantity':
            columnName = "Unit Quantity"; break;
        case 'TotalQuantityRejected':
            columnName = "Reject"; break;
        case 'TotalQuantityReturned': columnName = "Return"; break;
        case 'TotalQuantityTaken': columnName = "Taken"; break;
        case 'TotalShipedPrice':
        case 'TotalQuantityShiped': columnName = "Shiped"; break;
        case 'TotalSchemePrice':
        case 'TotalSchemeQuantity': columnName = "Price"; break;
        case 'UnitPrice': columnName = "Unit Price"; break;
        case 'CustomCaratPrices': columnName = "Custom Carat"; break;
    }
    return columnName;
}
