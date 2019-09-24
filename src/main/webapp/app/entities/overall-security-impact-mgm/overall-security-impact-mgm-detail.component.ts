import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { OverallSecurityImpactMgm } from './overall-security-impact-mgm.model';
import { OverallSecurityImpactMgmService } from './overall-security-impact-mgm.service';

@Component({
    selector: 'jhi-overall-security-impact-mgm-detail',
    templateUrl: './overall-security-impact-mgm-detail.component.html'
})
export class OverallSecurityImpactMgmDetailComponent implements OnInit, OnDestroy {

    overallSecurityImpact: OverallSecurityImpactMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private overallSecurityImpactService: OverallSecurityImpactMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInOverallSecurityImpacts();
    }

    load(id) {
        this.overallSecurityImpactService.find(id)
            .subscribe((overallSecurityImpactResponse: HttpResponse<OverallSecurityImpactMgm>) => {
                this.overallSecurityImpact = overallSecurityImpactResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInOverallSecurityImpacts() {
        this.eventSubscriber = this.eventManager.subscribe(
            'overallSecurityImpactListModification',
            (response) => this.load(this.overallSecurityImpact.id)
        );
    }
}
