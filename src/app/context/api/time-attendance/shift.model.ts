
export type IShift = {
    compId: number;
    code: number;
    deptId: number;
    shiftCode: string;
    name: string;
    otherCode: string;
    shiftType: null;
    nhinTime: Date;
    nhoutTime: Date;
    nhoutNextDay: boolean;
    nh: Date;
    resetNh: boolean;
    ot1: null;
    ot1inTime: Date;
    ot1outTime: Date;
    ot1outNextDay: boolean;
    ot2: null;
    ot2inTime: Date;
    ot2outTime: Date;
    ot2outNextDay: boolean;
    ot3: null;
    ot3inTime: Date;
    ot3outTime: Date;
    ot3outNextDay: boolean;
    breakHrs: Date;
    breakSwipe: boolean;
    fixedBreak: boolean;
    earlyInTime: Date;
    earlyPrevDay: boolean;
    earlyOutTime: Date;
    earlyPrevDayOutTime: boolean;
    earlyOt: number;
    earlyIntime2: Date;
    earlyPrevDayIn2: boolean;
    earlyOutTime2: Date;
    earlyPrevDayOut2: boolean;
    earlyOt2: number;
    isRosterShift: boolean;
    minOt: Date;
    roundOt: Date;
    swipGo: boolean;
    minSwipe: number;
    shiftStartRange: Date;
    shiftStartRangePrevDay: boolean;
    shiftEndRange: Date;
    shiftEndRangeNexDay: boolean;
    fullNhrs: null;
    earliestAllowed: Date;
    latestAllowed: Date;
    startPaying: Date;
    roundingInterval: Date;
    createdUser: number;
    createdDt: Date;
    lastUpdatedUser: number;
    lastUpdateDt: Date;
    active: boolean;
    deleted: boolean;
    shiftSelection: number;
    firstPunchStart: Date;
    firstPunchEnd: Date;
    firstPunchNextDay: boolean;
    secondPunchStart: Date;
    secondPunchEnd: Date;
    secondPunchNext: boolean;
    isSplitShift: boolean;
    breakIn: Date;
    breakInnextDay: boolean;
    breakOut: Date;
    breakOutNextDay: boolean;
    breakOt: number;
    legraceTobeAdjustedInexit: boolean;
    offDay: boolean;
    firstPunchLastPunch: number;
    ot1innextDay: boolean;
    ot2innextDay: boolean;
    ot3innextDay: boolean;
    eenextDay: number;
    alternativeOffDay: boolean;
    alternateWorkDayShift: string;
    secondPunchStartNextDay: boolean;
    shift2Intime: Date;
    shift2Outtime: Date;
    shift3Intime: Date;
    shift3Outtime: Date;
    shift3OutNextDay: boolean;
    compulsoryOt: Date;
    explanation: string;
    missingHrRequiered: boolean;
    leEeRequiered: boolean;
    isOteligible: boolean;
    shiftPeriod: number;
    ottype: string;
    specialOthrs: Date;
    specialOt: number;
    splShift: string;
    approvalNeeded: boolean;
    shiftMode: string;
    holiday: boolean;
    timeAdjustment: number;
    isSecurityShift: boolean;
}

export class ShiftModel implements IShift {
    compId: number = 0;
    code: number;
    deptId: number = 0;
    shiftCode: string = '';
    name: string = '';
    otherCode: string = '';
    shiftType: null;
    nhinTime: Date = new Date("1900-01-01");;
    nhoutTime: Date = new Date("1900-01-01");;
    nhoutNextDay: boolean;
    nh: Date = new Date("1900-01-01");;
    resetNh: boolean;
    ot1: null;
    ot1inTime: Date = new Date("1900-01-01");;
    ot1outTime: Date = new Date("1900-01-01");;
    ot1outNextDay: boolean;
    ot2: null;
    ot2inTime: Date = new Date("1900-01-01");;
    ot2outTime: Date = new Date("1900-01-01");;
    ot2outNextDay: boolean;
    ot3: null;
    ot3inTime: Date = new Date("1900-01-01");;
    ot3outTime: Date = new Date("1900-01-01");;
    ot3outNextDay: boolean;
    breakHrs: Date = new Date("1900-01-01");;
    breakSwipe: boolean;
    fixedBreak: boolean;
    earlyInTime: Date = new Date("1900-01-01");;
    earlyPrevDay: boolean;
    earlyOutTime: Date = new Date("1900-01-01");;
    earlyPrevDayOutTime: boolean;
    earlyOt: number;
    earlyIntime2: Date = new Date("1900-01-01");;
    earlyPrevDayIn2: boolean;
    earlyOutTime2: Date = new Date("1900-01-01");;
    earlyPrevDayOut2: boolean;
    earlyOt2: number;
    isRosterShift: boolean;
    minOt: Date = new Date("1900-01-01");;
    roundOt: Date = new Date("1900-01-01");;
    swipGo: boolean;
    minSwipe: number = 1;
    shiftStartRange: Date = new Date("1900-01-01");;
    shiftStartRangePrevDay: boolean;
    shiftEndRange: Date = new Date("1900-01-01");;
    shiftEndRangeNexDay: boolean;
    fullNhrs: null;
    earliestAllowed: Date = new Date("1900-01-01");;
    latestAllowed: Date = new Date("1900-01-01");;
    startPaying: Date = new Date("1900-01-01");;
    roundingInterval: Date = new Date("1900-01-01");;
    createdUser: number;
    createdDt: Date = new Date("1900-01-01");;
    lastUpdatedUser: number;
    lastUpdateDt: Date = new Date("1900-01-01");;
    active: boolean;
    deleted: boolean;
    shiftSelection: number;
    firstPunchStart: Date = new Date("1900-01-01");;
    firstPunchEnd: Date = new Date("1900-01-01");;
    firstPunchNextDay: boolean;
    secondPunchStart: Date = new Date("1900-01-01");;
    secondPunchEnd: Date = new Date("1900-01-01");;
    secondPunchNext: boolean;
    isSplitShift: boolean;
    breakIn: Date = new Date("1900-01-01");;
    breakInnextDay: boolean;
    breakOut: Date = new Date("1900-01-01");;
    breakOutNextDay: boolean;
    breakOt: number;
    legraceTobeAdjustedInexit: boolean;
    offDay: boolean;
    firstPunchLastPunch: number = 0;
    ot1innextDay: boolean;
    ot2innextDay: boolean;
    ot3innextDay: boolean;
    eenextDay: number;
    alternativeOffDay: boolean;
    alternateWorkDayShift: string = '';
    secondPunchStartNextDay: boolean;
    shift2Intime: Date = new Date("1900-01-01");
    shift2Outtime: Date = new Date("1900-01-01");
    shift3Intime: Date = new Date("1900-01-01");
    shift3Outtime: Date = new Date("1900-01-01");
    shift3OutNextDay: boolean;
    compulsoryOt: Date = new Date("1900-01-01");;
    explanation: string = '';
    missingHrRequiered: boolean;
    leEeRequiered: boolean;
    isOteligible: boolean;
    shiftPeriod: number;
    ottype: string = '';
    specialOthrs: Date = new Date("1900-01-01");;
    specialOt: number;
    splShift: string = '';
    approvalNeeded: boolean;
    shiftMode: string;
    holiday: boolean;
    timeAdjustment: number;
    isSecurityShift: boolean;

}

export class ShiftRequestModel {
    compId: number = 0;
    code: number;
    deptId: number = 0;
    shiftCode: string = '';
    name: string = '';
    otherCode: string = '';
    shiftType: null;
    nhinTime: any
    nhoutTime: any
    nhoutNextDay: boolean;
    nh: any
    resetNh: boolean;
    ot1: null;
    ot1inTime: any
    ot1outTime: any
    ot1outNextDay: boolean;
    ot2: null;
    ot2inTime: any
    ot2outTime: any
    ot2outNextDay: boolean;
    ot3: null;
    ot3inTime: any
    ot3outTime: any
    ot3outNextDay: boolean;
    breakHrs: any
    breakSwipe: boolean;
    fixedBreak: boolean;
    earlyInTime: any
    earlyPrevDay: boolean;
    earlyOutTime: any
    earlyPrevDayOutTime: boolean;
    earlyOt: number;
    earlyIntime2: any
    earlyPrevDayIn2: boolean;
    earlyOutTime2: any
    earlyPrevDayOut2: boolean;
    earlyOt2: number;
    isRosterShift: boolean;
    minOt: any
    roundOt: any
    swipGo: boolean;
    minSwipe: number = 1;
    shiftStartRange: any
    shiftStartRangePrevDay: boolean;
    shiftEndRange: any
    shiftEndRangeNexDay: boolean;
    fullNhrs: null;
    earliestAllowed: any
    latestAllowed: any
    startPaying: any
    roundingInterval: any
    createdUser: number;
    createdDt: any
    lastUpdatedUser: number;
    lastUpdateDt: any
    active: boolean;
    deleted: boolean;
    shiftSelection: number;
    firstPunchStart: any
    firstPunchEnd: any
    firstPunchNextDay: boolean;
    secondPunchStart: any
    secondPunchEnd: any
    secondPunchNext: boolean;
    isSplitShift: boolean;
    breakIn: any
    breakInnextDay: boolean;
    breakOut: any
    breakOutNextDay: boolean;
    breakOt: number;
    legraceTobeAdjustedInexit: boolean;
    offDay: boolean;
    firstPunchLastPunch: number = 0;
    ot1innextDay: boolean;
    ot2innextDay: boolean;
    ot3innextDay: boolean;
    eenextDay: number;
    alternativeOffDay: boolean;
    alternateWorkDayShift: string = '';
    secondPunchStartNextDay: boolean;
    shift2Intime: Date = new Date("1900-01-01");
    shift2Outtime: Date = new Date("1900-01-01");
    shift3Intime: Date = new Date("1900-01-01");
    shift3Outtime: Date = new Date("1900-01-01");
    shift3OutNextDay: boolean;
    compulsoryOt: any
    explanation: string = '';
    missingHrRequiered: boolean;
    leEeRequiered: boolean;
    isOteligible: boolean;
    shiftPeriod: number;
    ottype: string = '';
    specialOthrs: Date = new Date("1900-01-01");;
    specialOt: number;
    splShift: string = '';
    approvalNeeded: boolean;
    shiftMode: string;
    holiday: boolean;
    timeAdjustment: number;
    isSecurityShift: boolean;

}
