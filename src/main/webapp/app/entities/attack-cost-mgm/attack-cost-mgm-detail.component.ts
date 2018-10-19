import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { AttackCostMgm } from './attack-cost-mgm.model';
import { AttackCostMgmService } from './attack-cost-mgm.service';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-attack-cost-mgm-detail',
    templateUrl: './attack-cost-mgm-detail.component.html'
})
export class AttackCostMgmDetailComponent implements OnInit, OnDestroy {

    attackCost: AttackCostMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private attackCostService: AttackCostMgmService,
        private route: ActivatedRoute,
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInAttackCosts();
    }

    load(id) {
        this.attackCostService.find(id)
            .subscribe((attackCostResponse: HttpResponse<AttackCostMgm>) => {
                this.attackCost = attackCostResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInAttackCosts() {
        this.eventSubscriber = this.eventManager.subscribe(
            'attackCostListModification',
            (response) => this.load(this.attackCost.id)
        );
    }
}
