export class profileStorage {

    id?: string;
    idAllies?: string = 'kfc';
    nameAllie?: string;
    idHeadquarter?: string;
    nameHeadquarter?: string;
    nameCharge?: string;
    showContent?: content;
    reportPermissions?: reports;
}

export interface content {
    options: boolean;
    principal: boolean;
    reports: boolean;
    pqrs: boolean;
}

export interface reports {
    reportComplete: boolean;
    reportadminpdv: boolean;
    reportsummary: boolean;
}