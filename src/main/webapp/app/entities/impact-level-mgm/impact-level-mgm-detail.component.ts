import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { ImpactLevelMgm } from './impact-level-mgm.model';
import { ImpactLevelMgmService } from './impact-level-mgm.service';

@Component({
    selector: 'jhi-impact-level-mgm-detail',
    templateUrl: './impact-level-mgm-detail.component.html'
})
export class ImpactLevelMgmDetailComponent implements OnInit, OnDestroy {

    impactLevel: ImpactLevelMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private impactLevelService: ImpactLevelMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInImpactLevels();
    }

    load(id) {
        this.impactLevelService.find(id)
            .subscribe((impactLevelResponse: HttpResponse<ImpactLevelMgm>) => {
                this.impactLevel = impactLevelResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInImpactLevels() {
        this.eventSubscriber = this.eventManager.subscribe(
            'impactLevelListModification',
            (response) => this.load(this.impactLevel.id)
        );
    }
}
