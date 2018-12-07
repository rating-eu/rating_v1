import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { SplittingValueMgm } from './splitting-value-mgm.model';
import { SplittingValueMgmService } from './splitting-value-mgm.service';

@Component({
    selector: 'jhi-splitting-value-mgm-detail',
    templateUrl: './splitting-value-mgm-detail.component.html'
})
export class SplittingValueMgmDetailComponent implements OnInit, OnDestroy {

    splittingValue: SplittingValueMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private splittingValueService: SplittingValueMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInSplittingValues();
    }

    load(id) {
        this.splittingValueService.find(id)
            .subscribe((splittingValueResponse: HttpResponse<SplittingValueMgm>) => {
                this.splittingValue = splittingValueResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSplittingValues() {
        this.eventSubscriber = this.eventManager.subscribe(
            'splittingValueListModification',
            (response) => this.load(this.splittingValue.id)
        );
    }
}
