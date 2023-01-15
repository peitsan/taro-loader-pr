export interface DataType {
    key: React.Key;
    reason:string;
    planTime:string;
    manage:any[];
    current:string;
    code:number
    manageId:number[]
}

export interface Item {
    key: React.Key;
    reason:string;
    planTime:string;
    manage:any[];
    current:string;
    code:number;
    manageId:number[]
}

export interface IProps {
    item:Item[]
    index:number
    fresh:Function
}