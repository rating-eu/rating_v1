import {Component, OnInit} from '@angular/core';
import {DatasharingService} from "../../datasharing/datasharing.service";
import {MyCompanyMgm} from "../../entities/my-company-mgm";

@Component({
    selector: 'jhi-entry-point',
    templateUrl: './entry-point.component.html',
    styles: []
})
export class EntryPointComponent implements OnInit {

    public myCompany: MyCompanyMgm = undefined;

    constructor(private dataSharingService: DatasharingService) {
    }

    ngOnInit() {
        // Get the current MyCompany
        this.myCompany = this.dataSharingService.myCompany;

        // Listen for updates of MyCompany
        this.dataSharingService.myCompanyObservable.subscribe((myCompany: MyCompanyMgm) => {
            this.myCompany = myCompany;
        });
    }
}
