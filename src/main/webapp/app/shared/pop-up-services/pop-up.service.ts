/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

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
