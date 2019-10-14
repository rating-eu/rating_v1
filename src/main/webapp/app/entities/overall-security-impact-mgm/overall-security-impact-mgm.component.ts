import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { OverallSecurityImpactMgm } from './overall-security-impact-mgm.model';
import { OverallSecurityImpactMgmService } from './overall-security-impact-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-overall-security-impact-mgm',
    templateUrl: './overall-security-impact-mgm.component.html'
})
export class OverallSecurityImpactMgmComponent implements OnInit, OnDestroy {
overallSecurityImpacts: OverallSecurityImpactMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private overallSecurityImpactService: OverallSecurityImpactMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.overallSecurityImpactService.query().subscribe(
            (res: HttpResponse<OverallSecurityImpactMgm[]>) => {
                this.overallSecurityImpacts = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInOverallSecurityImpacts();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: OverallSecurityImpactMgm) {
        return item.id;
    }
    registerChangeInOverallSecurityImpacts() {
        this.eventSubscriber = this.eventManager.subscribe('overallSecurityImpactListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
