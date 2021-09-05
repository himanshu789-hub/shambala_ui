export enum OutgoingStatus {
    PENDING = 0, RETURNED, COMPLETED
}

export enum SchemeType {
    FIXED = 1, VARIABLE, NONE
}
export enum InvoiceStatus {
    DUE=1, COMPLTED
}
export enum SchemeKey {
    PERCENTAGE = 1, BOTTLE, CARET
}

export enum OutgoingStatusErrorCode {
    DUPLICATE = 1221, SCHEME_EXCEED, OUT_OF_STOCK, SCHEME_QUANTITY_NOT_VALID,SHIPED_QUANTITY_NOT_VALID,CUSTOM_CARAT_PRICE_NOT_VALID
}
