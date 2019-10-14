import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { DataRecipientMgm } from './data-recipient-mgm.model';
import { DataRecipientMgmService } from './data-recipient-mgm.service';

@Component({
    selector: 'jhi-data-recipient-mgm-detail',
    templateUrl: './data-recipient-mgm-detail.component.html'
})
export class DataRecipientMgmDetailComponent implements OnInit, OnDestroy {

    dataRecipient: DataRecipientMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dataRecipientService: DataRecipientMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInDataRecipients();
    }

    load(id) {
        this.dataRecipientService.find(id)
            .subscribe((dataRecipientResponse: HttpResponse<DataRecipientMgm>) => {
                this.dataRecipient = dataRecipientResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInDataRecipients() {
        this.eventSubscriber = this.eventManager.subscribe(
            'dataRecipientListModification',
            (response) => this.load(this.dataRecipient.id)
        );
    }
}
