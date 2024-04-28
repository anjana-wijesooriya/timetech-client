export class AttendanceDetailsModel {
    lateEntryHours: string = '00:00';
    totalHours: string = '00:00';
    earlyExitHours: string = '00:00';
    overtimeHours: string = '00:00';
    absent: number = 0;
    earlyEntry: number = 0;
    lateEntry: number = 0;
    missingSwipe: number = 0;
    attendanceSummery: PairValue[] = [];
}

export class PairValue {
    key: any;
    value: any;
    name: any;
}