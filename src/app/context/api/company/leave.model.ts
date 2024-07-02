export class LeaveType {
    empId: number;
    leaveCd: number;
    yearlyDays: number = 0;
    leaveCarryForward: boolean;
    leaveCarryForwardLimit: boolean;
    leaveCarryForwardLimitUpTo: number = 0;
    leaveEligibleForFullYear: boolean;
    isCalenderDays: boolean;
    leaveEligibleForFullServiceYear: boolean;
    hasOpeningLeave: boolean;
    openLeaveDays: number = 0;
    openLeaveEffectiveDate: Date;
    firstNYears: number = 0;
    defaultSecondDays: number = 0;
    secondDays: number = 0;
    isEligible: boolean = false;
    firstYears: number = 0;
    firstDays: number = 0;
}