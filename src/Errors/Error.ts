export class AlreadySubscribedError extends Error {
    constructor(componentId: number, subscriptionId: number) {
        super();
        this.message = `Component with Id=${componentId} of Subscription with Id = ${subscriptionId} already subcribed`;
        this.name = "AlreadySubscribedError"
    }
}
export class UnIdentifyComponentError extends Error {
    constructor(componentId: number, subscriptionId: number) {
        super();
        this.name = "UnIdentifyComponentError";
        this.message = `Subscription with Id=${subscriptionId} do not known about Component with Id=${componentId}`;
    }
}
export class UnIdentityFlavourError extends Error {
    constructor(productId: number, flavourId: number) {
        super();
        this.message = `ProductId=${productId} do not hold FlavourId=${flavourId}`;
        this.name = "UnIdentityFlavourError";
    }
}
export class FlavourOccupiedError extends Error {
    constructor(flavourId: number, productId: number, subscriptionId: number) {
        super();
        this.name = "FlavourOccupiedError";
        this.message = `FlavourId=${flavourId} of ProductId=${productId} has been already occupied in SubscriptionId=${subscriptionId}`;
    }
}
export class UnknownSubscription extends Error {

}
export class NullOrUndefinedError extends Error {
    constructor() {
        super();
        this.message = "A null or undefined value or reference exists";
    }
}
export class UnkownObserver extends Error {
    constructor(subscibeId: number, componentId: number) {
        super();
    }
}
export class QuantityLimitExceeded extends Error {
    constructor(productId: number, flavourId: number) {
        super();
        this.message = `Flavour with Id=${productId} of Product with Id=${productId},  Quantity Exceeded`;
    }
}
export class DeterminantsNotSetError extends Error {

}