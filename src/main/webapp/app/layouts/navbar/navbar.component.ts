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

import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewRef} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiLanguageService} from 'ng-jhipster';

import {ProfileService} from '../profiles/profile.service';
import {JhiLanguageHelper, LoginModalService, LoginService, Principal} from '../../shared';

import {VERSION} from '../../app.constants';
import {DatasharingService} from '../../datasharing/datasharing.service';
import {LayoutConfiguration} from '../model/LayoutConfiguration';
import {Role} from '../../entities/enumerations/Role.enum';
import {CompanyBoardStatus} from "../../dashboard/models/CompanyBoardStatus";
import {Status} from "../../entities/enumerations/Status.enum";
import {Subscription} from "rxjs";

@Component({
    selector: 'jhi-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: [
        'navbar.css'
    ]
})
export class NavbarComponent implements OnInit, OnDestroy {

    inProduction: boolean;
    isNavbarCollapsed: boolean;
    languages: any[];
    swaggerEnabled: boolean;
    modalRef: NgbModalRef;
    version: string;
    navSubTitle: string;
    selfAssessmentId: string;
    selfAssessmentName: string;
    sidebarCollapsed: boolean;
    companyName: string;
    public isAuthenticatedValue = false;
    public isExternal = false;
    public isAdmin = false;
    public companyBoardStatus: CompanyBoardStatus;
    public statusEnum = Status;
    private subscriptions: Subscription[];

    constructor(
        private loginService: LoginService,
        private languageService: JhiLanguageService,
        private languageHelper: JhiLanguageHelper,
        private principal: Principal,
        private loginModalService: LoginModalService,
        private profileService: ProfileService,
        private router: Router,
        private dataSharingService: DatasharingService,
        private changeDetector: ChangeDetectorRef
    ) {
        this.version = VERSION ? 'v' + VERSION : '';
        this.isNavbarCollapsed = true;
    }

    ngOnInit() {
        this.subscriptions = [];
        this.companyBoardStatus = this.dataSharingService.companyBoardStatus;

        if(this.changeDetector && !(this.changeDetector as ViewRef).destroyed){
            this.changeDetector.detectChanges();
        }

        this.languageHelper.getAll().then((languages) => {
            this.languages = languages;
        });

        this.profileService.getProfileInfo().then((profileInfo) => {
            this.inProduction = profileInfo.inProduction;
            this.swaggerEnabled = profileInfo.swaggerEnabled;
        });

        this.navSubTitle = this.dataSharingService.layoutConfiguration != null ? 'Selected self assessment: ' + this.dataSharingService.layoutConfiguration.navSubTitle : null;

        this.subscriptions.push(
            this.dataSharingService.layoutConfiguration$.subscribe((update: LayoutConfiguration) => {
                if (update && update.navSubTitle) {
                    this.navSubTitle = 'Selected self assessment: ';
                    this.selfAssessmentName = update.navSubTitle;
                    this.selfAssessmentId = update.selfAssessmentId;
                    this.sidebarCollapsed = update.isSidebarCollapsed;

                    if(this.changeDetector && !(this.changeDetector as ViewRef).destroyed){
                        this.changeDetector.detectChanges();
                    }
                }
            })
        );

        this.subscriptions.push(
            this.dataSharingService.role$.subscribe((role: Role) => {
                if (role) {
                    switch (role) {
                        case Role.ROLE_CISO: {
                            this.isAuthenticatedValue = true;
                            this.isAdmin = false;
                            this.isExternal = false;
                            break;
                        }
                        case Role.ROLE_EXTERNAL_AUDIT: {
                            this.isAuthenticatedValue = true;
                            this.isAdmin = false;
                            this.isExternal = true;
                            break;
                        }
                        case Role.ROLE_ADMIN: {
                            this.isAuthenticatedValue = true;
                            this.isAdmin = true;
                            this.isExternal = false;
                            break;
                        }
                        default: {
                            this.isAuthenticatedValue = false;
                            this.isAdmin = false;
                            this.isExternal = false;
                        }
                    }
                }
            })
        );

        this.subscriptions.push(
            this.dataSharingService.companyBoardStatus$.subscribe((status: CompanyBoardStatus) => {
                this.companyBoardStatus = status;
                if(this.changeDetector && !(this.changeDetector as ViewRef).destroyed){
                    this.changeDetector.detectChanges();
                }
            })
        );
    }

    changeLanguage(languageKey: string) {
        this.languageService.changeLanguage(languageKey);
    }

    collapseNavbar() {
        this.isNavbarCollapsed = true;
    }

    hideShowSideNav() {
        const layoutConfiguration: LayoutConfiguration = this.dataSharingService.layoutConfiguration;

        layoutConfiguration.isSidebarCollapsed = !layoutConfiguration.isSidebarCollapsed;
        this.sidebarCollapsed = layoutConfiguration.isSidebarCollapsed;

        layoutConfiguration.isSidebarCollapsedByMe = !layoutConfiguration.isSidebarCollapsedByMe;
        this.dataSharingService.layoutConfiguration = layoutConfiguration;
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    logout() {
        this.collapseNavbar();
        this.loginService.logout();
        const layoutConfiguration: LayoutConfiguration = this.dataSharingService.layoutConfiguration;
        this.dataSharingService.clear();
        layoutConfiguration.isSidebarCollapsed = true;
        layoutConfiguration.isSidebarCollapsedByMe = false;

        this.dataSharingService.layoutConfiguration = layoutConfiguration;

        this.router.navigate(['']);
    }

    toggleNavbar() {
        this.isNavbarCollapsed = !this.isNavbarCollapsed;
    }

    getImageUrl() {
        return this.isAuthenticated() ? this.principal.getImageUrl() : null;
    }

    ngOnDestroy(): void {
        this.changeDetector.detach();

        if (this.subscriptions && this.subscriptions.length) {
            this.subscriptions.forEach((subscription) => {
                subscription.unsubscribe();
            });
        }
    }
}
