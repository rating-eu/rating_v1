import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { EBITMgm } from './ebit-mgm.model';
import { EBITMgmService } from './ebit-mgm.service';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-ebit-mgm-detail',
    templateUrl: './ebit-mgm-detail.component.html'
})
export class EBITMgmDetailComponent implements OnInit, OnDestroy {

    eBIT: EBITMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private eBITService: EBITMgmService,
        private route: ActivatedRoute,
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInEBITS();
    }

    load(id) {
        this.eBITService.find(id)
            .subscribe((eBITResponse: HttpResponse<EBITMgm>) => {
                this.eBIT = eBITResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInEBITS() {
        this.eventSubscriber = this.eventManager.subscribe(
            'eBITListModification',
            (response) => this.load(this.eBIT.id)
        );
    }
}
