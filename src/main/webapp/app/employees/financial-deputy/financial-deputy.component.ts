import {Component, OnInit} from '@angular/core';
import {Role} from "../../entities/enumerations/Role.enum";

@Component({
    selector: 'jhi-financial-deputy',
    templateUrl: './financial-deputy.component.html',
    styles: []
})
export class FinancialDeputyComponent implements OnInit {

    public roleEnum = Role;

    constructor() {
    }

    ngOnInit() {
    }

}
