export class OrderByUser{
    id?:string;
    code?:string;
    idUser?:String;
    idHeadquartes?:string;
    nameAllie?:string;
    nameHeadquarter?:string;
    name?:string;
    typeOfService?:string;
    typeOfServiceobj?:object;
    purchaseAmount?:number;
    registerDate?:string;
    dateAndHourDelivery?:string;
    DateDelivery?: Date;
    quantity?:number[];
    nameDishe?:string[];
    controlOrder?:boolean;
    valueDishe?:number[];
    location?:string;
    costReservation?:number;
    costReservationIva?:number;
    percent?:number;
    valueIntermediation? :number;
    valueIntermediationIva? :number;
    timeTotal?:string;
    timeTotalCronometer?:string;
    orderStatus?:string;

    lastname?:string;
    email?:string;
    phone?:string;
    birthday?:string;
    gender?:string;
    password?:string;
    idAllie?:string;
    idHeadquarter?:string;
    usability?:number;
    selected?:boolean = false;
}