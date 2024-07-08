export type IHoliday = {
    code: number;
    name: string;
    eligibleTicket: number;
    dueOn: Date;
    expireOn: Date;
    requestTicket: number;
    isApproved: string;
    isRequested: number;
}
