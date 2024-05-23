import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorage } from 'src/app/enum/local-storage.enum';
import { LoginModel } from 'src/app/models/user/login.model';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading: boolean = false;
  loadingText: string = 'Login in...';
  signinForm: FormGroup;
  errorMsg: string = '';

  constructor(private router: Router, private fb: FormBuilder,
    private authService: AuthService) {

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
    this.authService.login(loginDetails).subscribe(response => {
      localStorage.setItem(LocalStorage.JWT, response.token);
      localStorage.setItem(LocalStorage.BaseModules, JSON.stringify(response.baseModules));
      response.baseModules = [];
      localStorage.setItem(LocalStorage.UserDetails, JSON.stringify(response));

      setTimeout(() => {
        if (response.isValidLogin) {
          this.router.navigate(['/self-service/dashboard']);
        } else {
          this.errorMsg = response.errorMsg;
        }
        this.loading = false;
      }, 100);
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
