import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { ExternalAuditMgm } from './external-audit-mgm.model';
import { ExternalAuditMgmService } from './external-audit-mgm.service';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-external-audit-mgm-detail',
    templateUrl: './external-audit-mgm-detail.component.html'
})
export class ExternalAuditMgmDetailComponent implements OnInit, OnDestroy {

    externalAudit: ExternalAuditMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private externalAuditService: ExternalAuditMgmService,
        private route: ActivatedRoute,
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInExternalAudits();
    }

    load(id) {
        this.externalAuditService.find(id)
            .subscribe((externalAuditResponse: HttpResponse<ExternalAuditMgm>) => {
                this.externalAudit = externalAuditResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInExternalAudits() {
        this.eventSubscriber = this.eventManager.subscribe(
            'externalAuditListModification',
            (response) => this.load(this.externalAudit.id)
        );
    }
}
