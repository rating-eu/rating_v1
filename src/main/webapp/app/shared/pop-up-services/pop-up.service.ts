import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';

@Injectable()
export class PopUpService {

    constructor(
        private router: Router,
        private sessionStorage: SessionStorageService
    ) { }

    public canOpen(): boolean {
        const isAfterLogIn = this.sessionStorage.retrieve('isAfterLogin');
        const userBehaviour = this.sessionStorage.retrieve('userBehaviour') ? this.sessionStorage.retrieve('userBehaviour') : false;

        if (isAfterLogIn && !userBehaviour) {
            this.sessionStorage.store('isAfterLogin', false);
            return false;
        }
        this.setOffUserBehaviour();
        return true;
    }

    public setOnUserBehaviour() {
        this.sessionStorage.store('userBehaviour', true);
    }

    public setOffUserBehaviour() {
        this.sessionStorage.store('userBehaviour', false);
    }
}
