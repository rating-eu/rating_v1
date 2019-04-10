import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'jhi-most-critical-attack-strategies-widget',
    templateUrl: './most-critical-attack-strategies-widget.component.html',
    styleUrls: ['most-critical-attack-strategies-widget.component.css']
})
export class MostCriticalAttackStrategiesWidgetComponent implements OnInit {
    public isCollapsed = true;
    public loading = false;

    constructor() {
    }

    ngOnInit() {
    }

}
