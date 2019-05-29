import {Component, OnInit} from '@angular/core';
import {Role} from "../../entities/enumerations/Role.enum";

@Component({
    selector: 'jhi-ciso',
    templateUrl: './ciso.component.html',
    styles: []
})
export class CisoComponent implements OnInit {

    public roleEnum = Role;

    constructor() {
    }

    ngOnInit() {
    }

}
