export interface Message {
    _id:string,
    message:string,
    sender:string,
    receiver:string,
    timestamp:string,
    seen:boolean
}