import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiLanguageService } from 'ng-jhipster';

import { ProfileService } from '../profiles/profile.service';
import { JhiLanguageHelper, Principal, LoginModalService, LoginService } from '../../shared';

import { VERSION } from '../../app.constants';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DatasharingService } from '../../datasharing/datasharing.service';
import { Update } from '../model/Update';

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
                this.navSubTitle = 'Selected self assessment: ' + update.navSubTitle;
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
