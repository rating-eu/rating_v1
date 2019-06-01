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

import {MainService} from './main.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';

import {AccountService, JhiLanguageHelper, LoginService, Principal, User, UserService} from '../../shared';
import {DatasharingService} from '../../datasharing/datasharing.service';
import {LayoutConfiguration} from '../model/LayoutConfiguration';
import {Role} from '../../entities/enumerations/Role.enum';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpResponse} from "@angular/common/http";
import {MyCompanyMgm, MyCompanyMgmService} from "../../entities/my-company-mgm";
import {Account} from "../../shared";
import {Observable, Subscription} from "rxjs";
import {switchMap} from "rxjs/operators";
import {of} from "rxjs/observable/of";
import {EmptyObservable} from "rxjs/observable/EmptyObservable";

@Component({
    selector: 'jhi-main',
    templateUrl: './main.component.html'
})
export class JhiMainComponent implements OnInit, OnDestroy {
    myCompany: MyCompanyMgm;
    user: User;
    account: Account;

    public updateLayout: LayoutConfiguration;
    public isAuthenticated = false;
    public isResetUrl = false;
    public isActivateUrl = false;
    public isExternal = false;
    public isCISO = false;
    public isAdmin = false;
    private closeResult: string;
    private role: Role;
    private subscriptions: Subscription[];

    constructor(
        private principal: Principal,
        private loginService: LoginService,
        private jhiLanguageHelper: JhiLanguageHelper,
        private router: Router,
        private dataSharingService: DatasharingService,
        private mainService: MainService,
        private modalService: NgbModal,
        private accountService: AccountService,
        private userService: UserService,
        private myCompanyService: MyCompanyMgmService
    ) {
        this.updateLayout = new LayoutConfiguration();
    }

    private getPageTitle(routeSnapshot: ActivatedRouteSnapshot) {
        let title: string = (routeSnapshot.data && routeSnapshot.data['pageTitle']) ? routeSnapshot.data['pageTitle'] : 'hermeneutApp';
        if (routeSnapshot.firstChild) {
            title = this.getPageTitle(routeSnapshot.firstChild) || title;
        }
        return title;
    }

    ngOnInit() {
        this.subscriptions = [];

        this.mainService.getMode().toPromise().then((res) => {
            if (res) {
                this.dataSharingService.mode = res;
            }
        });

        this.subscriptions.push(this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.jhiLanguageHelper.updateTitle(this.getPageTitle(this.router.routerState.snapshot.root));

                if (this.router.url.indexOf('reset/finish') !== -1) {
                    this.isResetUrl = true;
                } else {
                    this.isResetUrl = false;
                }

                if (this.router.url.indexOf('/activate') !== -1) {
                    this.isActivateUrl = true;
                } else {
                    this.isActivateUrl = false;
                }
            }
        }));

        this.subscriptions.push(this.dataSharingService.layoutConfigurationObservable.subscribe((update: LayoutConfiguration) => {
            if (update) {
                setTimeout(() => {
                    this.updateLayout = update;
                }, 0);
            }
        }));

        // Get notified each time authentication state changes.
        const account$: Observable<HttpResponse<Account>> = this.principal.getAuthenticationState().pipe(
            switchMap((authentication: any) => {
                if (authentication) {
                    this.isAuthenticated = true;
                    return this.accountService.get();
                } else {
                    this.isAuthenticated = false;
                    const layoutConfiguration: LayoutConfiguration = new LayoutConfiguration();
                    layoutConfiguration.isSidebarCollapsed = true;
                    layoutConfiguration.isSidebarCollapsedByMe = false;
                    this.dataSharingService.layoutConfiguration = layoutConfiguration;

                    this.resetRole();

                    return new EmptyObservable();
                }
            })
        );

        const user$: Observable<HttpResponse<User> | null> = account$.pipe(
            switchMap((accountResponse: HttpResponse<Account>) => {
                if (accountResponse) {
                    this.account = accountResponse.body;
                    this.dataSharingService.account = this.account;

                    return this.userService.find(this.account.login);
                } else {
                    this.account = null;
                    this.dataSharingService.account = this.account;

                    return new EmptyObservable();
                }
            })
        );

        const role$: Observable<Role | null> = user$.pipe(
            switchMap((userResponse: HttpResponse<User>) => {
                    if (userResponse) {
                        this.user = userResponse.body;
                        this.dataSharingService.user = this.user;

                        console.log("Main user:");
                        console.log(this.user);

                        if (this.user.authorities && this.user.authorities.length) {
                            if (this.user.authorities.includes(Role[Role.ROLE_ADMIN])) {
                                return of(Role.ROLE_ADMIN);
                            } else if (this.user.authorities.includes(Role[Role.ROLE_CISO])) {
                                return of(Role.ROLE_CISO);
                            } else if (this.user.authorities.includes(Role[Role.ROLE_CISO_DEPUTY])) {
                                return of(Role.ROLE_CISO_DEPUTY);
                            } else if (this.user.authorities.includes(Role[Role.ROLE_EXTERNAL_AUDIT])) {
                                return of(Role.ROLE_EXTERNAL_AUDIT);
                            } else if (this.user.authorities.includes(Role[Role.ROLE_FINANCIAL_DEPUTY])) {
                                return of(Role.ROLE_FINANCIAL_DEPUTY);
                            }
                        } else {
                            return new EmptyObservable();
                        }
                    } else {
                        this.user = null;
                        this.dataSharingService.user = this.user;
                        return new EmptyObservable();
                    }
                }
            )
        );

        const myCompany$: Observable<HttpResponse<MyCompanyMgm> | null> = role$.pipe(
            switchMap((roleResponse: Role) => {
                if (roleResponse) {
                    this.role = roleResponse;
                    this.dataSharingService.role = this.role;

                    return this.myCompanyService.findByUser(this.user.id);
                } else {
                    this.role = null;
                    this.dataSharingService.role = this.role;

                    return new EmptyObservable();
                }
            })
        );

        this.subscriptions.push(myCompany$.subscribe((myCompanyResponse: HttpResponse<MyCompanyMgm>) => {
            if (myCompanyResponse) {
                this.myCompany = myCompanyResponse.body;
            } else {
                this.myCompany = null;
            }

            console.log("Main MyCompany");
            console.log(this.myCompany);

            this.dataSharingService.myCompany = this.myCompany;
        }));

        if (this.principal.isAuthenticated()) {
            this.isAuthenticated = this.principal.isAuthenticated();
            this.updateRole();
        }
    }

    private updateRole() {
        this.checkRole(Role.ROLE_EXTERNAL_AUDIT);

        this.checkRole(Role.ROLE_CISO);

        this.checkRole(Role.ROLE_ADMIN);
    }

    private checkRole(role: Role) {
        const ROLE_STRING: string = Role[role];
        const layoutConfiguration: LayoutConfiguration = new LayoutConfiguration();

        switch (role) {
            case Role.ROLE_CISO: {
                this.principal.hasAuthority(ROLE_STRING).then((response: boolean) => {
                    this.isCISO = response;

                    if (this.isCISO) {
                        this.role = Role.ROLE_CISO;
                        this.dataSharingService.role = Role.ROLE_CISO;

                        layoutConfiguration.isSidebarCollapsed = false;
                        layoutConfiguration.isSidebarCollapsedByMe = false;
                        this.dataSharingService.layoutConfiguration = layoutConfiguration;
                    }
                });
                break;
            }
            case Role.ROLE_EXTERNAL_AUDIT: {
                this.principal.hasAuthority(ROLE_STRING).then((response: boolean) => {
                    this.isExternal = response;

                    if (this.isExternal) {
                        this.role = Role.ROLE_EXTERNAL_AUDIT;
                        this.dataSharingService.role = Role.ROLE_EXTERNAL_AUDIT;

                        layoutConfiguration.isSidebarCollapsed = true;
                        layoutConfiguration.isSidebarCollapsedByMe = false;
                        this.dataSharingService.layoutConfiguration = layoutConfiguration;
                    }
                });
                break;
            }
            case Role.ROLE_ADMIN: {
                this.principal.hasAuthority(ROLE_STRING).then((response: boolean) => {
                    this.isAdmin = response;

                    if (this.isAdmin) {
                        this.role = Role.ROLE_ADMIN;
                        layoutConfiguration.isSidebarCollapsed = true;
                        layoutConfiguration.isSidebarCollapsedByMe = false;
                        this.dataSharingService.layoutConfiguration = layoutConfiguration;
                        this.dataSharingService.role = Role.ROLE_ADMIN;
                    }
                });
                break;
            }
        }

    }

    private resetRole() {
        this.isAuthenticated = false;
        this.isAdmin = false;
        this.isExternal = false;
        this.isCISO = false;

        this.dataSharingService.role = null;
    }

    open(content) {
        this.modalService.open(content, {size: 'lg'}).result.then((result) => {
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

    ngOnDestroy(): void {
        if (this.subscriptions && this.subscriptions.length) {
            this.subscriptions.forEach((subscription) => {
                subscription.unsubscribe();
            });
        }
    }
}
