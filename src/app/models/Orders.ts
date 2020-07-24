export class Orders {
    id?:string;
    code?:string;
    idUser?:string;
    allyId?:string;
    nameAllies?:string;
    idHeadquartes?:string;
    nameHeadquartes?:string;
    idDishe?:string[];
    nameDishe?:string[];
    valueDishe?:number;
    typeOfService?:object;
    typeOfServiceobj?:object;
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