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
        this.dataSharingService.observeUpdate().subscribe((update: Update) => {
            if (update) {
                this.updateLayout = update;
            }
        });
    }
}
