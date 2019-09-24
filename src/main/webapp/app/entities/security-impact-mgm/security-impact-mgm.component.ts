import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { SecurityImpactMgm } from './security-impact-mgm.model';
import { SecurityImpactMgmService } from './security-impact-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-security-impact-mgm',
    templateUrl: './security-impact-mgm.component.html'
})
export class SecurityImpactMgmComponent implements OnInit, OnDestroy {
securityImpacts: SecurityImpactMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private securityImpactService: SecurityImpactMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.securityImpactService.query().subscribe(
            (res: HttpResponse<SecurityImpactMgm[]>) => {
                this.securityImpacts = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInSecurityImpacts();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: SecurityImpactMgm) {
        return item.id;
    }
    registerChangeInSecurityImpacts() {
        this.eventSubscriber = this.eventManager.subscribe('securityImpactListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
