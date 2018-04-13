import { Component, OnInit } from '@angular/core';
import { Principal } from '../shared';

@Component({
    selector: 'jhi-identify-asset',
    templateUrl: './identify-asset.component.html'
})
export class IdentifyAssetComponent implements OnInit {
    account: Account;

    constructor(private principal: Principal) {}

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
    }
}
