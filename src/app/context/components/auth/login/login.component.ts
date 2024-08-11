import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginModel } from 'src/app/context/api/user/login.model';
import { AuthService } from 'src/app/context/service/auth.service';
import { LocalStorage } from 'src/app/context/shared/enum/local-storage.enum';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { BaseService } from 'src/app/context/service/base.service';
import { StateService } from 'src/app/context/service/sharedstate/state.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        .pi-eye,
        .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {

    valCheck: string[] = ['remember'];
    loading: boolean = false;
    loadingText: string = 'Login in...';
    signinForm: FormGroup;
    errorMsg: string = '';

    constructor(private router: Router, private fb: FormBuilder, public layoutService: LayoutService,
        private authService: AuthService, private msgService: MessageService, private baseService: BaseService,
    ) {

    }

    ngOnInit(): void {
        this.signinForm = this.fb.group({
            username: [null, Validators.compose([Validators.required])],
            password: [null, Validators.compose([Validators.required, Validators.minLength(3)])]
        });
    }

    login() {
        this.loading = true;
        const loginDetails: LoginModel = this.signinForm.value
        this.msgService.clear();
        this.authService.login(loginDetails).subscribe(response => {
            localStorage.setItem(LocalStorage.JWT, response.token);
            localStorage.setItem(LocalStorage.BaseModules, JSON.stringify(response.baseModules));
            response.baseModules = [];
            localStorage.setItem(LocalStorage.UserDetails, JSON.stringify(response));
            this.baseService.setLoginDetails(response);

            // this.state.setState(response);
            // this.state.setState(response.baseModules);
            // this.state.setState(response.token as any);
            if (response.isValidLogin) {
                this.router.navigate(['']);
            } else {
                this.msgService.add({ severity: 'error', summary: 'Login fail', detail: response.errorMsg });
                this.errorMsg = response.errorMsg;
            }
            this.loading = false;
        });
    }

    onSubmitLogin() {
        this.errorMsg = '';
        if (!this.signinForm.invalid) {
            this.login();
        }
    }

    get username(): AbstractControl {
        return this.signinForm.get('username')!;
    }

    get password(): AbstractControl {
        return this.signinForm.get('password')!;
    }

}
