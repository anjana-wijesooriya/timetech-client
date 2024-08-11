export type IHoliday = {
    year: number;
    code: number;
    compId: number;
    holiday: Date;
    holidayName: string;
    createdBy: number;
    createdOn: Date;
    updatedBy: number;
    lastUpdatedDt: Date;
    deptId: number;
    isLeaveProcessed: boolean;
    isCompensationRequiered: boolean;
    isUpdate: boolean;
}
