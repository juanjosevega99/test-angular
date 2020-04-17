export class profileStorage {

    id?: string = '';
    idAllies?: string = '';
    nameAllie?: string = 'kfc';
    idHeadquarter?: string = '';
    nameHeadquarter?: string = '';
    nameCharge?: string = '';
    showContent?: content = {
        options: false,
        principal: false,
        reports: false,
        pqrs: false
    };
    reportPermissions?: reports = {
        reportComplete : false,
        reportadminpdv : false,
        reportsummary : false,
    };


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