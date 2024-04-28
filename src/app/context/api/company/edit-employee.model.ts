export class EditEmployeeModel {
  empID: number = 0;
  empCd: string = '';
  empName: string = '';
  empShName: string = '';
  loginUser: string = '';
  hasWebLogin: boolean;
  cardNo: string = '';
  fingerPrint: string = '';
  email: string = '';
  mobileNo: string = '';
  telephone: string = '';
  userProfile: number | undefined | null;
  enrollID: number;
  hasEmergencyContact: boolean = false;
  costCenter: number;
  reportTo: number | undefined | null;
  glCodeDebit: string = '';
  glCodeCredit: string = '';
  isEmpOnLeave: boolean;
  isShiftEmployee: boolean;
  isOTEligible: boolean;
  isPermanentOff: boolean;
  dob: string = '';
  birthDateString: string = '';
  birthDate: Date;
  joinDt: string = '';
  joinDate: Date;
  joinDtString: string = '';
  serviceStartDt: string = '';
  serviceStartDate: Date;
  serviceStartDtString: string = '';
  discontinuedDt: string = '';
  discontinuedDate: Date;
  discontinuedDtString: string = '';
  workRuleStartDate: string = '';
  workRuleStartDt: Date;
  workRuleStartDateString: string = '';
  discontinued: boolean;
  discontinueIcon: string = '';
  discontinuedString: string = '';
  discontinuedReason: string = '';
  discontinuedReasonId: number | undefined | null;
  resignationDate: string = '';
  resignationDt: Date;
  basicSalary: number;
  nonSwiper: number;
  fpUflag: boolean;
  kjAdmin: number;
  maritalStatusCd: number | undefined | null;
  maritalStatusDs: string = '';
  active: boolean;
  sex: number | undefined | null;
  sexString: string = ''
  bloodGroup: string = ''
  compCd: number;
  compDs: string = ''
  deptId: number | undefined | null;
  deptCd: string = '';
  deptDs: string = '';
  cpr: string = '';
  desgCd: number | undefined | null;
  desgDs: string = '';
  wrkRulCd: number | undefined | null;
  wrkRulDs: string = '';
  relgCd: number | undefined | null;
  relgDs: string = '';
  grpCd: number | undefined | null;
  grpDs: string = '';
  locationCd: number | undefined | null;
  locationName: string = '';
  nationCd: number | undefined | null;
  nationDs: string = '';
  birthCd: string = '';
  birthDs: string = '';
  homeCountryCd: number | undefined | null;
  homeCountryDs: string = '';
  imagePath: string = '';
  deptSection: number | undefined | null;
  license: string = '';
  hasCompanyAccommodation: boolean;
  area: string = '';
  block: string = '';
  road: string = '';
  building: string = '';
  roomNo: string = '';
  personalEmail: string = '';
  emergencyContactName: string = '';
  emergencyContactRelation: string = '';
  emergencyContactNo: string = '';
  empNote: string = '';
  empArabicName: string | number = '';
  empArabicShName: string | number = '';
  reportToPerson: string = '';
  reportToEmpCode: string = '';
  otCalculationsHours: number;
  isSelectBlockOnMobile: boolean;
  isProjectEmployee: boolean;
  isNotificationRequired: boolean;
  rootDeptCode: string = '';
  rootDeptName: string = '';
  parentDeptCode: string = '';
  parentDeptName: string = '';
  isAlternateSaturdayOFF: boolean;
  altSaturdayOffStartsOn: null;
  empFirstName: string = '';
  empMiddleName: string = '';
  empLastName: string = '';
  hasMobilePunching: boolean;
  isVisitorsAllowed: boolean;
}

export interface IEmployeeBasic {
  id: number
  code: string
  name: string
  department: string
  company: string
  active: boolean
  profileId: number
}

export interface IContact {
  empId: number
  code: number
  contactType: number
  address: string
  telephone: string
  mobileNo: string
  email: string
  effectiveDate: string
  notes: string
}

export interface IDependent {
  code: number
  dependentName: string
  dateBirth: Date
  relation: string
  hasAirTicket: boolean
  gender: number
  majorMinor: number
  isVisaCostByCompany: boolean
  hasOpenTicket: boolean
  openingDate: Date
  openingTicket: any
  isSchoolFee: boolean
  monthlyFeeAmount: number
  isBasedOnFeeReceipt: boolean
  paySchoolFeeYearly: boolean
  schoolFeeYearlyPayMonth: number
}

export class DependentModel {
  code: number | string = "";
  dependentName: string = "";
  dateBirth: Date | undefined = undefined;
  relation: string | undefined = undefined;
  hasAirTicket: boolean = false;
  gender: number | undefined = undefined;
  majorMinor: number | undefined = undefined;
  isVisaCostByCompany: boolean = false
  hasOpenTicket: boolean = false
  openingDate: Date | undefined = undefined;
  openingTicket: string = "";
  isSchoolFee: boolean = false;
  monthlyFeeAmount: number | undefined = undefined;
  isBasedOnFeeReceipt: boolean = false;
  paySchoolFeeYearly: boolean = false;
  schoolFeeYearlyPayMonth: boolean | undefined = undefined;
  payMonth: number | undefined = undefined;
  loggedUserId: number;
  companyId: number;
  employeeId: number;
}

export class WebLoginModel {
  loggedUserId: number;
  companyId: number;
  employeeId: number;
  customerId: number;
  companyCode: string;
  allowWebLogin: boolean;
  username: string;
}

export class ChangePasswordModel {
  loggedUserId: number
  companyId: number
  employeeId: number
  customerId: number
  companyCode: string
  password: string
  confirmPassword: string
}

export interface DepatmentRightsModel {
  id: number
  code: string
  name: string
  companyName: string
  parentId: number
  active: boolean
  loggedUserId: number
  companyId: number
  employeeId: number
  customerId: number
  companyCode: any
}

export class DocumentModel {
  id: number = 0
  name: string | undefined = ''
  docType: string = ''
  docTypeId: number
  docNo: string = ''
  active: boolean = false
  expiryDate: Date | any;
  markAsOld: boolean = false
  dependentCode: number | null = null
  doc: number | null = 0
  remindMe: boolean = false
  attachmentOne: string = ''
  attachmentTwo: string = ''
  attachmentThree: string = ''
  fromSelfService: boolean = false;
  isApproved: boolean = false
  canEmpDelete: boolean = false
  isAvailableInSelfService: boolean = false
  dependentName: any = ''
  hasAttachments: boolean = false
  remindBefore: any
  placeOfIssue: any = '';
  issueDate: any;
  linkedTo: any = null;
  markAsOldDate: any;
  notes: any = '';
  remindOn: any;
  employeeId: number;
  loggedUser: number;
  companyId: number;
}

