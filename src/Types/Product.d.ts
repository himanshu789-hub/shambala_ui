
type CaretDetails =
{
    Id:number;
    CaretSize:number;
}
type Flavour= {
    Id:number;
    Title:string;
    Quantity?:number;
}
export type Product = 
{
    Id:number,
    Name:string,
    Carets:CaretDetails[],
    Flavour:Flavour[];
}
