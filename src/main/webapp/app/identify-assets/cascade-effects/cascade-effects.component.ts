import * as _ from 'lodash';

import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'cascade-effects',
    templateUrl: './cascade-effects.component.html',
    styleUrls: ['./cascade-effects.component.css'],
})

export class CascadeEffectsComponent implements OnInit, OnDestroy {
    ngOnDestroy(): void {
    }
    ngOnInit(): void {
    }
}
