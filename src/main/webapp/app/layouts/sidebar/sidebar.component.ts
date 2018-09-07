import {Component, OnInit,} from '@angular/core';
import {Principal} from '../../shared';

@Component({
    selector: 'jhi-sidebar',
    templateUrl: './sidebar.component.html',
    styles: []
})
export class SidebarComponent implements OnInit {

    isCollapsed: boolean;

    constructor(private principal: Principal) {
        this.isCollapsed = true;
    }

    ngOnInit() {
    }

    toggle() {
        this.isCollapsed = !this.isCollapsed;
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }
}
