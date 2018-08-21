import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { CriticalLevelMgm } from './critical-level-mgm.model';
import { CriticalLevelMgmService } from './critical-level-mgm.service';

@Component({
    selector: 'jhi-critical-level-mgm-detail',
    templateUrl: './critical-level-mgm-detail.component.html'
})
export class CriticalLevelMgmDetailComponent implements OnInit, OnDestroy {

    criticalLevel: CriticalLevelMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private criticalLevelService: CriticalLevelMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCriticalLevels();
    }

    load(id) {
        this.criticalLevelService.find(id)
            .subscribe((criticalLevelResponse: HttpResponse<CriticalLevelMgm>) => {
                this.criticalLevel = criticalLevelResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCriticalLevels() {
        this.eventSubscriber = this.eventManager.subscribe(
            'criticalLevelListModification',
            (response) => this.load(this.criticalLevel.id)
        );
    }
}
