import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiLanguageService, JhiAlertService } from 'ng-jhipster';

import { ProfileService } from '../profiles/profile.service';
import { JhiLanguageHelper, Principal, LoginModalService, LoginService, User, AccountService, UserService } from '../../shared';

import { VERSION } from '../../app.constants';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DatasharingService } from '../../datasharing/datasharing.service';
import { Update } from '../model/Update';
import { MyCompanyMgm, MyCompanyMgmService } from '../../entities/my-company-mgm';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { CompanyProfileMgm, CompanyProfileMgmService } from '../../entities/company-profile-mgm';
import { MyCompanyComponent } from '../../my-company/my-company.component';

@Component({
    selector: 'jhi-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: [
        'navbar.css'
    ]
})
export class NavbarComponent implements OnInit {
    private static NOT_FOUND = 404;
    private user: User;
    private myCompany: MyCompanyMgm;
    private error: HttpErrorResponse;
    private message: string;
    private companyProfiles: CompanyProfileMgm[];
    private companyProfile: CompanyProfileMgm;

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

    constructor(
        private loginService: LoginService,
        private languageService: JhiLanguageService,
        private languageHelper: JhiLanguageHelper,
        private principal: Principal,
        private loginModalService: LoginModalService,
        private profileService: ProfileService,
        private router: Router,
        private dataSharingService: DatasharingService,
        private accountService: AccountService,
        private userService: UserService,
        private myCompanyService: MyCompanyMgmService,
        private companyProfileService: CompanyProfileMgmService,
        private jhiAlertService: JhiAlertService
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

        this.accountService.get().subscribe((response1) => {
            const loggedAccount: Account = response1.body;
            this.userService.find(loggedAccount['login']).subscribe((response2) => {
                this.user = response2.body;

                if (this.user) {
                    this.myCompanyService.findByUser(this.user.id).subscribe(
                        (response3: HttpResponse<MyCompanyMgm>) => {
                            this.myCompany = response3.body;
                            this.companyName = this.myCompany.companyProfile.name;
                        }/*,
                        (error: any) => {
                            this.error = error;

                            if (this.error.status === NavbarComponent.NOT_FOUND) {
                                this.jhiAlertService.error('http.' + this.error.status, null, null);

                                this.companyProfileService.query().subscribe(
                                    (response4: HttpResponse<CompanyProfileMgm[]>) => {
                                        this.companyProfiles = response4.body;
                                    }
                                );
                            }
                        }
                        */
                    );
                }
            });
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
