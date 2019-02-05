import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRouteSnapshot, NavigationEnd} from '@angular/router';

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

                this.updateRole();
            }
        });

        this.loginService.checkLogin().then((check: boolean) => {
            this.isAuthenticated = check;
        });
    }

    private updateRole() {
        const ROLE_EXTERNAL_AUDIT: string = MyRole[MyRole.ROLE_EXTERNAL_AUDIT];
        console.log('Role string: ' + ROLE_EXTERNAL_AUDIT);

        const ROLE_CISO: string = MyRole[MyRole.ROLE_CISO];
        console.log('Role string: ' + ROLE_CISO);

        const ROLE_ADMIN: string = MyRole[MyRole.ROLE_ADMIN];
        console.log('Role admin: ' + ROLE_ADMIN);

        this.principal.hasAuthority(ROLE_EXTERNAL_AUDIT).then((response: boolean) => {
            this.isExternal = response;
            console.log('is External RESPONSE: ' + response);
        });

        this.principal.hasAuthority(ROLE_CISO).then((response: boolean) => {
            this.isCISO = response;
            console.log('is CISO RESPONSE: ' + response);
        });

        this.principal.hasAuthority(ROLE_ADMIN).then((response: boolean) => {
            this.isAdmin = response;
            console.log('is ADMIN RESPONSE: ' + response);
        });
    }
}
