import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRouteSnapshot, NavigationEnd} from '@angular/router';

import {JhiLanguageHelper, LoginService, Principal} from '../../shared';
import {DatasharingService} from '../../datasharing/datasharing.service';
import {Update} from '../model/Update';

@Component({
    selector: 'jhi-main',
    templateUrl: './main.component.html'
})
export class JhiMainComponent implements OnInit {

    public updateLayout: Update;
    public isAuthenticated = false;
    public loading = true;

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
            }
        });

        this.dataSharingService.observeUpdate().subscribe((update: Update) => {
            if (update) {
                this.updateLayout = update;
            }

            console.log('Update onInit: ' + JSON.stringify(update));
        });

        this.principal.getAuthenticationState().subscribe((authentication: any) => {
            console.log('AuthenticationState: ' + JSON.stringify(authentication));

            if (authentication) {
                this.isAuthenticated = true;
            } else {
                this.isAuthenticated = false;
            }
        });

        this.loginService.checkLogin().then((check: boolean) => {
            console.log('Check login: ' + check);

            this.isAuthenticated = check;
            this.loading = false;
        });
    }
}
