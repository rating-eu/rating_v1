import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { CompanySectorMgm } from './company-sector-mgm.model';
import { CompanySectorMgmService } from './company-sector-mgm.service';

@Component({
    selector: 'jhi-company-sector-mgm-detail',
    templateUrl: './company-sector-mgm-detail.component.html'
})
export class CompanySectorMgmDetailComponent implements OnInit, OnDestroy {

    companySector: CompanySectorMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private companySectorService: CompanySectorMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCompanySectors();
    }

    load(id) {
        this.companySectorService.find(id)
            .subscribe((companySectorResponse: HttpResponse<CompanySectorMgm>) => {
                this.companySector = companySectorResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCompanySectors() {
        this.eventSubscriber = this.eventManager.subscribe(
            'companySectorListModification',
            (response) => this.load(this.companySector.id)
        );
    }
}
