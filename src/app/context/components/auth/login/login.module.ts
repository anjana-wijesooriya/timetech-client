import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from 'src/app/context/service/auth.service';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { NgxParticlesModule } from '@tsparticles/angular';

@NgModule({
    imports: [
        CommonModule,
        LoginRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        ReactiveFormsModule,
        PasswordModule,
        MessagesModule,
        NgxParticlesModule
    ],
    declarations: [LoginComponent],
    providers: [
        AuthService,
        MessageService,
    ]
})
export class LoginModule { }
