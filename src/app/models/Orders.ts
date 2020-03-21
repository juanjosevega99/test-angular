export class Orders {
    _id?:string;
    code?:string;
    idUser?:string;
    idAllies?:string;
    nameAllies?:string;
    idHeadquartes?:string;
    nameHeadquartes?:string;
    idDishe?:string;
    nameDishe?:string;
    valueDishe?:number;
    typeOfService?:string;
    orderValue?:number;
    dateAndHourReservation?:Date;
    dateAndHourDelivey?:Date;
    chronometer?:number;
    orderStatus?:string;
    quantity?:number;
    deliveryStatus?:boolean;
    costReservation: number;
    costReservationIva: number;

}