import { PairValue } from "../models/dashboard/attendance-details.model";

export class EmployeeSupport {
    public static BLOOD_GROUPS: PairValue[] = [
        { key: 'A+', name: '', value: 'A+' },
        { key: 'A-', name: '', value: 'A-' },
        { key: 'B+', name: '', value: 'B+' },
        { key: 'B-', name: '', value: 'B-' },
        { key: 'O+', name: '', value: 'O+' },
        { key: 'O-', name: '', value: 'O-' },
        { key: 'AB+', name: '', value: 'AB+' },
        { key: 'AB-', name: '', value: 'AB-' },
    ];

    public static MARITAL_STATUS: PairValue[] = [
        { key: 1, name: 'Divorced', value:'' },
        { key: 2, name: 'Married', value:'' },
        { key: 3, name: 'Separated', value:'' },
        { key: 4, name: 'Single', value:'' },
        { key: 5, name: 'Widowed', value:'' }
    ];

    public static GENDER: PairValue[] = [
        { key: 1, name: 'Male', value:'' },
        { key: 2, name: 'Female', value:'' },
    ];

    public static CONTACT_TYPES: PairValue[] = [
        { key: 1, name: 'Home', value:'' },
        { key: 2, name: 'Office', value:'' },
        { key: 3, name: 'Other', value:'' },
    ];

    public static DEPENDENT_TYPES: PairValue[] = [
        { key: 1, name: 'Major', value:'' },
        { key: 2, name: 'Minor', value:'' },
    ];

    public static DEPENDENT_RELATION: PairValue[] = [
        { key: 1, name: 'HUSBAND', value:'Husband' },
        { key: 2, name: 'WIFE', value:'Wife' },
        { key: 3, name: 'SON', value:'Son' },
        { key: 4, name: 'DAUGHTER', value:'Daughter' },
    ];

    public static MONTHS: PairValue[] = [
        { key: 1, name: 'January', value:'' },
        { key: 2, name: 'Februay', value:'' },
        { key: 3, name: 'March', value:'' },
        { key: 4, name: 'April', value:'' },
        { key: 5, name: 'May', value:'' },
        { key: 6, name: 'June', value:'' },
        { key: 7, name: 'July', value:'' },
        { key: 8, name: 'August', value:'' },
        { key: 9, name: 'September', value:'' },
        { key: 10, name: 'October', value:'' },
        { key: 11, name: 'November', value:'' },
        { key: 12, name: 'December', value:'' },
    ];
}

