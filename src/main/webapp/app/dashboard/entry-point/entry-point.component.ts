import {Component, OnInit} from '@angular/core';
import {DataSharingService} from "../../data-sharing/data-sharing.service";
import {MyCompanyMgm} from "../../entities/my-company-mgm";

@Component({
    selector: 'jhi-entry-point',
    templateUrl: './entry-point.component.html',
    styles: []
})
export class EntryPointComponent implements OnInit {

    public myCompany: MyCompanyMgm = undefined;

    constructor(private dataSharingService: DataSharingService) {
    }

    ngOnInit() {
        // Get the current MyCompany
        this.myCompany = this.dataSharingService.myCompany;

        // Listen for updates of MyCompany
        this.dataSharingService.myCompany$.subscribe((myCompany: MyCompanyMgm) => {
            this.myCompany = myCompany;
        });
    }
}
