import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { DataThreatMgm } from './data-threat-mgm.model';
import { DataThreatMgmService } from './data-threat-mgm.service';

@Component({
    selector: 'jhi-data-threat-mgm-detail',
    templateUrl: './data-threat-mgm-detail.component.html'
})
export class DataThreatMgmDetailComponent implements OnInit, OnDestroy {

    dataThreat: DataThreatMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dataThreatService: DataThreatMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInDataThreats();
    }

    load(id) {
        this.dataThreatService.find(id)
            .subscribe((dataThreatResponse: HttpResponse<DataThreatMgm>) => {
                this.dataThreat = dataThreatResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInDataThreats() {
        this.eventSubscriber = this.eventManager.subscribe(
            'dataThreatListModification',
            (response) => this.load(this.dataThreat.id)
        );
    }
}
