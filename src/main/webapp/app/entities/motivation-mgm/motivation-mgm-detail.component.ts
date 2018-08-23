import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { MotivationMgm } from './motivation-mgm.model';
import { MotivationMgmService } from './motivation-mgm.service';

@Component({
    selector: 'jhi-motivation-mgm-detail',
    templateUrl: './motivation-mgm-detail.component.html'
})
export class MotivationMgmDetailComponent implements OnInit, OnDestroy {

    motivation: MotivationMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private motivationService: MotivationMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInMotivations();
    }

    load(id) {
        this.motivationService.find(id)
            .subscribe((motivationResponse: HttpResponse<MotivationMgm>) => {
                this.motivation = motivationResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInMotivations() {
        this.eventSubscriber = this.eventManager.subscribe(
            'motivationListModification',
            (response) => this.load(this.motivation.id)
        );
    }
}
