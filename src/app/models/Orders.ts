export class Orders {
    id?:string;
    code?:string;
    idUser?:string;
    idAllies?:string;
    nameAllies?:string;
    idHeadquartes?:string;
    nameHeadquartes?:string;
    idDishe?:string;
    nameDishe?:string;
    typeOfService?:string;
    orderValue?:number;
    dateAndHourReservation?:Date;
    dateAndHourDelivey?:Date;
    chronometer?:number;
    orderStatus?:string;
    deliveryStatus?:boolean;
}