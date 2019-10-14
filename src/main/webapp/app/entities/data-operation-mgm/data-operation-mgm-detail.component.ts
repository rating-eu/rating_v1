import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { DataOperationMgm } from './data-operation-mgm.model';
import { DataOperationMgmService } from './data-operation-mgm.service';

@Component({
    selector: 'jhi-data-operation-mgm-detail',
    templateUrl: './data-operation-mgm-detail.component.html'
})
export class DataOperationMgmDetailComponent implements OnInit, OnDestroy {

    dataOperation: DataOperationMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dataOperationService: DataOperationMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInDataOperations();
    }

    load(id) {
        this.dataOperationService.find(id)
            .subscribe((dataOperationResponse: HttpResponse<DataOperationMgm>) => {
                this.dataOperation = dataOperationResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInDataOperations() {
        this.eventSubscriber = this.eventManager.subscribe(
            'dataOperationListModification',
            (response) => this.load(this.dataOperation.id)
        );
    }
}
