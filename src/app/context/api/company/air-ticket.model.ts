import { Type } from "@angular/core";

export type AirTicketHistory = {
    code: number;
    airLine: string;
    ticketNo: string;
    travelDate: Date;
    returnDate: Date;
    noTickets: number;
    amount: number;
    canBeDeleted: boolean;
    dependentName: string;
    relation: string;
    dependentId: number;
    settlementCode: string;
    leaveRefNo: number;
    type: string;
    referenceNo: string;
}

export type IAirTicketDetails = {
    imagePath: string;
    empName: string;
    dependentName: string;
    compId: number;
    empId: number;
    code: number;
    dependentId: number;
    airSector: number;
    issuedBy: string;
    docDate: Date;
    trip1Route: string;
    trip1FlightNo: string;
    trip1Date: Date;
    trip2Route: string;
    trip2FlightNo: string;
    trip2Date: Date;
    ticketReturn: boolean;
    amount: number;
    ticketTakenDt: Date;
    note: string;
    noTickets: number;
    settlementCode: null;
    currency: number;
    ticketNo: string;
    favourOf: string;
    attn: string;
    createdBy: number;
    createdOn: Date;
    updatedBy: null;
    updatedOn: Date;
    contractStartDt: Date;
    contractEndDt: Date;
    isDeleted: boolean;
    leaveRefNo: number;
    isClosed: boolean;
    bookingNo: string;
    airLineAgency: number;
    passportNo: string;
    attach1: string;
    attach2: string;
    attach3: string;
    attachment1: string;
    attachment2: string;
    attachment3: string;
    isBooked: boolean;
    budgetedAmount: number;
    amountDifference: number;
    paymentVoucher: boolean;
    paymentRefNo: null;
    isReImbursement: boolean;
    empTicketList: any[];
}

export class AirTicketDetails implements IAirTicketDetails {
    note: string;
    imagePath = '';
    empName = '';
    dependentName = '';
    compId = 0;
    empId = 0;
    code = 0;
    dependentId = 0;
    airSector = 0;
    issuedBy = '';
    docDate = null;
    trip1Route = '';
    trip1FlightNo = '';
    trip1Date = null;
    trip2Route = '';
    trip2FlightNo = '';
    trip2Date = null;
    ticketReturn = false;
    amount = 0;
    ticketTakenDt = null;
    // get ticketTakenDt() { return new Date(this.ticketTakenDt); }
    // set ticketTakenDt(v) { this.ticketTakenDt = new Date(v); }
    noTickets = 0;
    settlementCode = null;
    currency = 0;
    ticketNo = '';
    favourOf = '';
    attn = '';
    createdBy = 0;
    createdOn = null;
    updatedBy = null;
    updatedOn = null;
    contractStartDt = null;
    contractEndDt = null;
    isDeleted = false;
    leaveRefNo = 0;
    isClosed = false;
    bookingNo = '';
    airLineAgency = 0;
    passportNo = '';
    attach1 = '';
    attach2 = '';
    attach3 = '';
    attachment1 = '';
    attachment2 = '';
    attachment3 = '';
    isBooked = false;
    budgetedAmount = 0;
    amountDifference = 0;
    paymentVoucher = false;
    paymentRefNo = null;
    isReImbursement = false;
    empTicketList = [];
}

export type IAirSectorSummery = {
    empId: number;
    serVStDt: Date;
    deptId: number;
    openingTicket: number;
    ticketsEarned: number;
    ticketsTaken: number;
    ticketsExpiered: number;
    availableTickets: number;
    airSector: string;
    yearlyTickets: number;
}

export type AirTicket = {
    code: number;
    name: string;
    eligibleTicket: number;
    dueOn: Date;
    expireOn: Date;
    requestTicket: number;
    isApproved: string;
    isRequested: number;
    lastAvailedOn: Date;
}
