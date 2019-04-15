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
import {Router} from '@angular/router';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiLanguageService} from 'ng-jhipster';

import {ProfileService} from '../profiles/profile.service';
import {JhiLanguageHelper, LoginModalService, LoginService, Principal} from '../../shared';

import {VERSION} from '../../app.constants';
import {DatasharingService} from '../../datasharing/datasharing.service';
import {Update} from '../model/Update';
import {MyRole} from '../../entities/enumerations/MyRole.enum';

@Component({
    selector: 'jhi-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: [
        'navbar.css'
    ]
})
export class NavbarComponent implements OnInit {

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

    constructor(
        private loginService: LoginService,
        private languageService: JhiLanguageService,
        private languageHelper: JhiLanguageHelper,
        private principal: Principal,
        private loginModalService: LoginModalService,
        private profileService: ProfileService,
        private router: Router,
        private dataSharingService: DatasharingService
    ) {
        this.version = VERSION ? 'v' + VERSION : '';
        this.isNavbarCollapsed = true;
    }

    ngOnInit() {
        this.languageHelper.getAll().then((languages) => {
            this.languages = languages;
        });

        this.profileService.getProfileInfo().then((profileInfo) => {
            this.inProduction = profileInfo.inProduction;
            this.swaggerEnabled = profileInfo.swaggerEnabled;
        });

        this.navSubTitle = this.dataSharingService.getUpdate() != null ? 'Selected self assessment: ' + this.dataSharingService.getUpdate().navSubTitle : null;
        this.dataSharingService.observeUpdate().subscribe((update: Update) => {
            if (update && update.navSubTitle) {
                this.navSubTitle = 'Selected self assessment: ';
                this.selfAssessmentName = update.navSubTitle;
                this.selfAssessmentId = update.selfAssessmentId;
                this.sidebarCollapsed = update.isSidebarCollapsed;
            }
        });

        this.dataSharingService.observeRole().subscribe((role: MyRole) => {
            if (role) {
                switch (role) {
                    case MyRole.ROLE_CISO: {
                        this.isAuthenticatedValue = true;
                        this.isAdmin = false;
                        this.isExternal = false;
                        break;
                    }
                    case MyRole.ROLE_EXTERNAL_AUDIT: {
                        this.isAuthenticatedValue = true;
                        this.isAdmin = false;
                        this.isExternal = true;
                        break;
                    }
                    case MyRole.ROLE_ADMIN: {
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
        });
    }

    changeLanguage(languageKey: string) {
        this.languageService.changeLanguage(languageKey);
    }

    collapseNavbar() {
        this.isNavbarCollapsed = true;
    }

    hideShowSideNav() {
        const updateLayout: Update = this.dataSharingService.getUpdate();
        updateLayout.isSidebarCollapsed = !this.dataSharingService.getUpdate().isSidebarCollapsed;
        this.sidebarCollapsed = updateLayout.isSidebarCollapsed;
        updateLayout.isSidebarCollapsedByMe = !this.dataSharingService.getUpdate().isSidebarCollapsedByMe;
        this.dataSharingService.updateLayout(updateLayout);
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
        const update: Update = this.dataSharingService.getUpdate();
        this.dataSharingService.clear();
        update.isSidebarCollapsed = true;
        update.isSidebarCollapsedByMe = false;

        this.dataSharingService.updateLayout(update);

        this.router.navigate(['']);
    }

    toggleNavbar() {
        this.isNavbarCollapsed = !this.isNavbarCollapsed;
    }

    getImageUrl() {
        return this.isAuthenticated() ? this.principal.getImageUrl() : null;
    }
}
