import { Subscription } from 'rxjs/Subscription';
import { Mode } from './../entities/enumerations/Mode.enum';
import { DatasharingService } from './../datasharing/datasharing.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Account, LoginModalService, Principal } from '../shared';

@Component({
    selector: 'jhi-about',
    templateUrl: './about.us.component.html',
    styleUrls: [
        'home.css'
    ]
})
export class AboutUsComponent implements OnInit, OnDestroy {
    public isRating = false;
    public isCompact = false;
    private modeSubs: Subscription;

    constructor(
        private dataSharing: DatasharingService
    ) {

    }

    ngOnInit() {
        this.modeSubs = this.dataSharing.observeMode().subscribe((mode: Mode) => {
            if (mode === Mode.RATING) {
                this.isRating = true;
            } else if (mode === Mode.COMPACT) {
                this.isCompact = true;
            }
        });
    }

    ngOnDestroy() {
        this.modeSubs.unsubscribe();
    }
}
