import { Component, AfterViewInit, Renderer, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { JhiEventManager } from 'ng-jhipster';

import { LoginService } from '../login/login.service';
import { StateStorageService } from '../auth/state-storage.service';
import { RegisterComponent } from '../../account/register/register.component';
import { PasswordResetInitComponent } from '../../account/password-reset/init/password-reset-init.component';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-login-plain',
  templateUrl: './login-plain.component.html',
  styleUrls: [
     'login-plain.css'
  ]
})
export class LoginPlainComponent implements AfterViewInit {
    authenticationError: boolean;
        password: string;
        rememberMe: boolean;
        username: string;
        credentials: any;

        constructor(
            private eventManager: JhiEventManager,
            private loginService: LoginService,
            private stateStorageService: StateStorageService,
            private elementRef: ElementRef,
            private renderer: Renderer,
            private router: Router,
            private modalService: NgbModal
        ) {
            this.credentials = {};
        }

        ngAfterViewInit() {
            this.renderer.invokeElementMethod(this.elementRef.nativeElement.querySelector('#username'), 'focus', []);
        }

        cancel() {
            this.credentials = {
                username: null,
                password: null,
                rememberMe: true
            };
            this.authenticationError = false;
        }

        login() {
            this.loginService.login({
                username: this.username,
                password: this.password,
                rememberMe: this.rememberMe
            }).then(() => {
                this.authenticationError = false;
                if (this.router.url === '/register' || (/^\/activate\//.test(this.router.url)) ||
                    (/^\/reset\//.test(this.router.url))) {
                    this.router.navigate(['']);
                }

                this.eventManager.broadcast({
                    name: 'authenticationSuccess',
                    content: 'Sending Authentication Success'
                });

                // // previousState was set in the authExpiredInterceptor before being redirected to login modal.
                // // since login is succesful, go to stored previousState and clear previousState
                const redirect = this.stateStorageService.getUrl();
                if (redirect) {
                    this.stateStorageService.storeUrl(null);
                    this.router.navigate([redirect]);
                }
            }).catch(() => {
                this.authenticationError = true;
            });
        }

        register() {
            this.router.navigate(['/register']);
        }

        requestResetPassword() {
            const modalRef = this.modalService.open(PasswordResetInitComponent);
            modalRef.componentInstance.name = 'Password Reset';
        }

}
