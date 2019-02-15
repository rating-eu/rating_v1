import { Component, OnInit } from '@angular/core';
import { DatasharingService } from '../../datasharing/datasharing.service';
import { Update } from '../model/Update';

@Component({
    selector: 'jhi-footer',
    templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {
    updateLayout: Update;

    constructor(
        private dataSharingService: DatasharingService
    ) { }

    ngOnInit() {
        this.updateLayout = this.dataSharingService.getUpdate();
        if (!this.updateLayout) {
            this.updateLayout = new Update();
            this.updateLayout.isSidebarCollapsed = false;
            this.updateLayout.isSidebarCollapsedByMe = false;
        }
        this.dataSharingService.observeUpdate().subscribe((update: Update) => {
            if (update) {
                setTimeout(() => {
                    this.updateLayout = update;
                }, 0);
            }
        });
    }
}
