// import { Injectable } from "@angular/core";
// import { StateService } from "./state.service";
// import { LoginResponseModel } from "../../api/user/login-response.model";
// import { Observable } from "rxjs";


// @Injectable({
//     providedIn: 'root'
// })
// export class UserStateService extends StateService<LoginResponseModel>{
//     user: Observable<LoginResponseModel> = this.select(state => this.state);
//     constructor() {
//         super(initialState);
//     }

// }

// const initialState: UserState = {
//     LoginUser: new LoginResponseModel(),
// };