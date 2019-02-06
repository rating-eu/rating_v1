import {Component, OnInit} from '@angular/core';
import {ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';

import {JhiLanguageHelper, LoginService, Principal} from '../../shared';
import {DatasharingService} from '../../datasharing/datasharing.service';
import {Update} from '../model/Update';
import {MyRole} from '../../entities/enumerations/MyRole.enum';

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

    constructor(
        private principal: Principal,
        private loginService: LoginService,
        private jhiLanguageHelper: JhiLanguageHelper,
        private router: Router,
        private dataSharingService: DatasharingService
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
        console.log('MAIN ngOnInit');

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
        console.log('Updating Role...');

        const ROLE_EXTERNAL_AUDIT: string = MyRole[MyRole.ROLE_EXTERNAL_AUDIT];
        console.log('Role string: ' + ROLE_EXTERNAL_AUDIT);
        this.checkRole(MyRole.ROLE_EXTERNAL_AUDIT);

        const ROLE_CISO: string = MyRole[MyRole.ROLE_CISO];
        console.log('Role string: ' + ROLE_CISO);
        this.checkRole(MyRole.ROLE_CISO);

        const ROLE_ADMIN: string = MyRole[MyRole.ROLE_ADMIN];
        console.log('Role admin: ' + ROLE_ADMIN);
        this.checkRole(MyRole.ROLE_ADMIN);
    }

    private checkRole(role: MyRole) {
        const ROLE_STRING: string = MyRole[role];
        console.log('Checking Role');

        switch (role) {
            case MyRole.ROLE_CISO: {
                this.principal.hasAuthority(ROLE_STRING).then((response: boolean) => {
                    this.isCISO = response;
                    console.log('Is CISO: ' + this.isCISO);

                    if (this.isCISO) {
                        console.log('Redirecting to Dashboard...CISO');
                        this.dataSharingService.updateRole(MyRole.ROLE_CISO);
                        // this.router.navigate(['/dashboard']);
                    }
                });
                break;
            }
            case MyRole.ROLE_EXTERNAL_AUDIT: {
                this.principal.hasAuthority(ROLE_STRING).then((response: boolean) => {
                    this.isExternal = response;
                    console.log('Is External: ' + this.isExternal);

                    if (this.isExternal) {
                        console.log('Redirecting to MySelfAssessments...External');

                        this.dataSharingService.updateRole(MyRole.ROLE_EXTERNAL_AUDIT);
                        // this.router.navigate(['/my-self-assessments']);
                    }
                });
                break;
            }
            case MyRole.ROLE_ADMIN: {
                this.principal.hasAuthority(ROLE_STRING).then((response: boolean) => {
                    this.isAdmin = response;
                    console.log('Is Admin: ' + this.isAdmin);

                    if (this.isAdmin) {
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
}
