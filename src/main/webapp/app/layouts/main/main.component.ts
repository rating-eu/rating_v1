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
import {Component, OnInit} from '@angular/core';
import {ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';

import {JhiLanguageHelper, LoginService, Principal} from '../../shared';
import {DatasharingService} from '../../datasharing/datasharing.service';
import {Update} from '../model/Update';
import {MyRole} from '../../entities/enumerations/MyRole.enum';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'jhi-main',
    templateUrl: './main.component.html'
})
export class JhiMainComponent implements OnInit {

    public updateLayout: Update;
    public isAuthenticated = false;
    public isResetUrl = false;
    public isExternal = false;
    public isCISO = false;
    public isAdmin = false;
    private closeResult: string;

    constructor(
        private principal: Principal,
        private loginService: LoginService,
        private jhiLanguageHelper: JhiLanguageHelper,
        private router: Router,
        private dataSharingService: DatasharingService,
        private mainService: MainService,
        private modalService: NgbModal
    ) {
        this.updateLayout = new Update();
    }

    private getPageTitle(routeSnapshot: ActivatedRouteSnapshot) {
        let title: string = (routeSnapshot.data && routeSnapshot.data['pageTitle']) ? routeSnapshot.data['pageTitle'] : 'hermeneutApp';
        if (routeSnapshot.firstChild) {
            title = this.getPageTitle(routeSnapshot.firstChild) || title;
        }
        return title;
    }

    ngOnInit() {
        this.mainService.getMode().toPromise().then((res) => {
            if (res) {
                this.dataSharingService.updateMode(res);
            }
        });
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.jhiLanguageHelper.updateTitle(this.getPageTitle(this.router.routerState.snapshot.root));

                if (this.router.url.indexOf('reset/finish') !== -1) {
                    this.isResetUrl = true;
                } else {
                    this.isResetUrl = false;
                }
            }
        });

        this.dataSharingService.observeUpdate().subscribe((update: Update) => {
            if (update) {
                setTimeout(() => {
                    this.updateLayout = update;
                }, 0);
            }
        });

        // Get notified each time authentication state changes.
        this.principal.getAuthenticationState().subscribe((authentication: any) => {
            if (authentication) {
                this.isAuthenticated = true;

                this.updateRole();
            } else {
                this.isAuthenticated = false;
                const updateLayout: Update = new Update();
                updateLayout.isSidebarCollapsed = true;
                updateLayout.isSidebarCollapsedByMe = false;
                this.dataSharingService.updateLayout(updateLayout);

                this.resetRole();
            }
        });

        if (this.principal.isAuthenticated()) {
            this.isAuthenticated = this.principal.isAuthenticated();
            this.updateRole();
        }
    }

    private updateRole() {
        this.checkRole(MyRole.ROLE_EXTERNAL_AUDIT);

        this.checkRole(MyRole.ROLE_CISO);

        this.checkRole(MyRole.ROLE_ADMIN);
    }

    private checkRole(role: MyRole) {
        const ROLE_STRING: string = MyRole[role];
        const updateLayout: Update = new Update();

        switch (role) {
            case MyRole.ROLE_CISO: {
                this.principal.hasAuthority(ROLE_STRING).then((response: boolean) => {
                    this.isCISO = response;

                    if (this.isCISO) {
                        this.dataSharingService.updateRole(MyRole.ROLE_CISO);
                        updateLayout.isSidebarCollapsed = false;
                        updateLayout.isSidebarCollapsedByMe = false;
                        this.dataSharingService.updateLayout(updateLayout);
                    }
                });
                break;
            }
            case MyRole.ROLE_EXTERNAL_AUDIT: {
                this.principal.hasAuthority(ROLE_STRING).then((response: boolean) => {
                    this.isExternal = response;

                    if (this.isExternal) {
                        this.dataSharingService.updateRole(MyRole.ROLE_EXTERNAL_AUDIT);
                        updateLayout.isSidebarCollapsed = true;
                        updateLayout.isSidebarCollapsedByMe = false;
                        this.dataSharingService.updateLayout(updateLayout);
                    }
                });
                break;
            }
            case MyRole.ROLE_ADMIN: {
                this.principal.hasAuthority(ROLE_STRING).then((response: boolean) => {
                    this.isAdmin = response;

                    if (this.isAdmin) {
                        updateLayout.isSidebarCollapsed = true;
                        updateLayout.isSidebarCollapsedByMe = false;
                        this.dataSharingService.updateLayout(updateLayout);
                        this.dataSharingService.updateRole(MyRole.ROLE_ADMIN);
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

        this.dataSharingService.updateRole(null);
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
