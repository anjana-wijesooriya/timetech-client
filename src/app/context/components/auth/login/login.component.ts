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
import {
    MoveDirection,
    ClickEvent,
    HoverEvent,
    OutMode,
    Container,
} from "@tsparticles/engine";
import { NgParticlesService } from "@tsparticles/angular";
import { loadSlim } from "@tsparticles/slim";

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
        private ngParticlesService: NgParticlesService
    ) {

    }

    ngOnInit(): void {
        this.signinForm = this.fb.group({
            username: [null, Validators.compose([Validators.required])],
            password: [null, Validators.compose([Validators.required, Validators.minLength(3)])]
        });

        this.ngParticlesService.init(async (engine) => {
            console.log(engine);

            // Starting from 1.19.0 you can add custom presets or shape here, using the current tsParticles instance (main)
            // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
            // starting from v2 you can add only the features you need reducing the bundle size
            //await loadFull(engine);
            await loadSlim(engine);
        });
    }

    particlesLoaded(container: Container): void {
        console.log(container);
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

    id = "tsparticles";
    particlesOptions = {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 700
                }
            },
            color: {
                value: "#ffffff"
            },
            shape: {
                type: "circle",
                stroke: {
                    width: 0,
                    color: "#000000"
                },
                polygon: {
                    nb_sides: 5
                }
            },
            opacity: {
                value: 0.5,
                random: false,
                anim: {
                    enable: false,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#ffffff",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 6,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "grab"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    }
}
