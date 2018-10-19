import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { AttackStrategyMgm } from './attack-strategy-mgm.model';
import { AttackStrategyMgmService } from './attack-strategy-mgm.service';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-attack-strategy-mgm-detail',
    templateUrl: './attack-strategy-mgm-detail.component.html'
})
export class AttackStrategyMgmDetailComponent implements OnInit, OnDestroy {

    attackStrategy: AttackStrategyMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private attackStrategyService: AttackStrategyMgmService,
        private route: ActivatedRoute,
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInAttackStrategies();
    }

    load(id) {
        this.attackStrategyService.find(id)
            .subscribe((attackStrategyResponse: HttpResponse<AttackStrategyMgm>) => {
                this.attackStrategy = attackStrategyResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInAttackStrategies() {
        this.eventSubscriber = this.eventManager.subscribe(
            'attackStrategyListModification',
            (response) => this.load(this.attackStrategy.id)
        );
    }
}
