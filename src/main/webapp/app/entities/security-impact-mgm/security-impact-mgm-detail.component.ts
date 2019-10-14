import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { SecurityImpactMgm } from './security-impact-mgm.model';
import { SecurityImpactMgmService } from './security-impact-mgm.service';

@Component({
    selector: 'jhi-security-impact-mgm-detail',
    templateUrl: './security-impact-mgm-detail.component.html'
})
export class SecurityImpactMgmDetailComponent implements OnInit, OnDestroy {

    securityImpact: SecurityImpactMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private securityImpactService: SecurityImpactMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInSecurityImpacts();
    }

    load(id) {
        this.securityImpactService.find(id)
            .subscribe((securityImpactResponse: HttpResponse<SecurityImpactMgm>) => {
                this.securityImpact = securityImpactResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSecurityImpacts() {
        this.eventSubscriber = this.eventManager.subscribe(
            'securityImpactListModification',
            (response) => this.load(this.securityImpact.id)
        );
    }
}
