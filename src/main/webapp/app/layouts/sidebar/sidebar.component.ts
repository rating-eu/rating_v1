import {Component, OnInit,} from '@angular/core';
import {Principal} from '../../shared';
import {DatasharingService} from '../../datasharing/datasharing.service';
import {Update} from '../model/Update';

@Component({
    selector: 'jhi-sidebar',
    templateUrl: './sidebar.component.html',
    styles: []
})
export class SidebarComponent implements OnInit {

    isCollapsed: boolean = true;

    constructor(private principal: Principal, private dataSharingService: DatasharingService) {
        this.isCollapsed = true;
        console.log('DataSharing: ' + JSON.stringify(dataSharingService));
    }

    ngOnInit() {
        this.isCollapsed = this.dataSharingService.getUpdate() != null ? this.dataSharingService.getUpdate().isSidebarCollapsed : true;

        let updateLayout: Update = this.dataSharingService.getUpdate();
        if (updateLayout) {
            this.isCollapsed = updateLayout.isSidebarCollapsed;
        }

        this.dataSharingService.observeUpdate().subscribe((update: Update) => {
            if (update) {
                this.isCollapsed = update.isSidebarCollapsed;
            }
        });

        this.principal.getAuthenticationState().subscribe((identity) => {
            if (identity) {
                this.isCollapsed = !this.isAuthenticated();
                console.log('SIdebar isAuthenticated: ' + this.isAuthenticated());

                updateLayout = new Update();
                updateLayout.isSidebarCollapsed = this.isCollapsed;

                this.dataSharingService.updateLayout(updateLayout);
            } else {

            }
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    toggleSideBar() {
        let update: Update = this.dataSharingService.getUpdate();

        if (update) {
            update.isSidebarCollapsed = !update.isSidebarCollapsed;
        } else {
            update = new Update();
            update.isSidebarCollapsed = !this.principal.isAuthenticated();
        }

        this.dataSharingService.updateLayout(update);
    }
}
