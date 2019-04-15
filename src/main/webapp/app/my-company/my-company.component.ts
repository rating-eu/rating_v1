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

import {Component, OnInit} from '@angular/core';
import {AccountService, User, UserService} from '../shared/index';
import {MyCompanyMgm, MyCompanyMgmService} from '../entities/my-company-mgm/index';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
// import {CompanyProfileMgm, CompanyProfileMgmService} from '../entities/company-profile-mgm/index';
// import {JhiAlertService} from 'ng-jhipster';

@Component({
    selector: 'jhi-my-company',
    templateUrl: './my-company.component.html',
    styles: []
})
export class MyCompanyComponent implements OnInit {

    private static NOT_FOUND = 404;
    private user: User;
    public myCompany: MyCompanyMgm;
    public error: HttpErrorResponse;
    public message: string;
    // public companyProfiles: CompanyProfileMgm[];
    // public companyProfile: CompanyProfileMgm;

    constructor(private accountService: AccountService,
                private userService: UserService,
                private myCompanyService: MyCompanyMgmService,
                /*private companyProfileService: CompanyProfileMgmService,
                private jhiAlertService: JhiAlertService*/) {
    }

    ngOnInit() {
        this.accountService.get().subscribe((response1) => {
            const loggedAccount: Account = response1.body;
            this.userService.find(loggedAccount['login']).subscribe((response2) => {
                this.user = response2.body;

                if (this.user) {
                    this.myCompanyService.findByUser(this.user.id).subscribe(
                        (response3: HttpResponse<MyCompanyMgm>) => {
                            this.myCompany = response3.body;
                        },
                        (error: any) => {
                            this.error = error;

                            /*if (this.error.status === MyCompanyComponent.NOT_FOUND) {
                                this.jhiAlertService.error('http.' + this.error.status, null, null);

                                this.companyProfileService.query().subscribe(
                                    (response4: HttpResponse<CompanyProfileMgm[]>) => {
                                        this.companyProfiles = response4.body;
                                    }
                                );
                            }*/
                        }
                    );
                }
            });
        });
    }

    /*saveMyCompany() {
        this.myCompany = new MyCompanyMgm(undefined, this.user, this.companyProfile);
        this.myCompanyService.create(this.myCompany).subscribe((response: HttpResponse<MyCompanyMgm>) => {
            this.myCompany = response.body;
            this.jhiAlertService.success('hermeneutApp.messages.saved', null, null);
        });
    }*/

    /*previousState() {
        window.history.back();
    }*/
}
