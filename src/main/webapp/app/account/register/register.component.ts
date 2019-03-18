import {Component, OnInit, AfterViewInit, Renderer, ElementRef} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {ModalDismissReasons, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiLanguageService} from 'ng-jhipster';

import {Register} from './register.service';
import {LoginModalService, EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE} from '../../shared';
import {RegisterAccount} from './register.account.model';

@Component({
    selector: 'jhi-register',
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit, AfterViewInit {

    termsAccepted = false;
    confirmPassword: string;
    doNotMatch: string;
    error: string;
    errorEmailExists: string;
    errorUserExists: string;
    registerAccount: RegisterAccount;
    success: boolean;
    modalRef: NgbModalRef;
    private closeResult: string;

    constructor(
        private languageService: JhiLanguageService,
        private loginModalService: LoginModalService,
        private registerService: Register,
        private elementRef: ElementRef,
        private renderer: Renderer,
        private modalService: NgbModal
    ) {
    }

    ngOnInit() {
        this.success = false;
        this.registerAccount = new RegisterAccount();
    }

    ngAfterViewInit() {
        this.renderer.invokeElementMethod(this.elementRef.nativeElement.querySelector('#login'), 'focus', []);
    }

    register() {
        if (this.registerAccount.password !== this.confirmPassword) {
            this.doNotMatch = 'ERROR';
        } else {
            this.doNotMatch = null;
            this.error = null;
            this.errorUserExists = null;
            this.errorEmailExists = null;
            this.languageService.getCurrent().then((key) => {
                this.registerAccount.langKey = key;
                this.registerService.save(this.registerAccount).subscribe(() => {
                    this.success = true;
                }, (response) => this.processError(response));
            });
        }
    }

    openLogin() {
        this.modalRef = this.loginModalService.open();
    }

    private processError(response: HttpErrorResponse) {
        this.success = null;
        if (response.status === 400 && response.error.type === LOGIN_ALREADY_USED_TYPE) {
            this.errorUserExists = 'ERROR';
        } else if (response.status === 400 && response.error.type === EMAIL_ALREADY_USED_TYPE) {
            this.errorEmailExists = 'ERROR';
        } else {
            this.error = 'ERROR';
        }
    }

    open(content) {
        this.modalService.open(content, { size: 'lg' }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }
}
