import { Component, OnInit } from '@angular/core';
import { Principal } from '../shared';

@Component({
    selector: 'jhi-evaluate-weackness',
    templateUrl: './evaluate-weackness.component.html'
})
export class EvaluateWeacknessComponent implements OnInit {
    account: Account;

    constructor(private principal: Principal) {}

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
    }
    previousState() {
        window.history.back();
    }
}
