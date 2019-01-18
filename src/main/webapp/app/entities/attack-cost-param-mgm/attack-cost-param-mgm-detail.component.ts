import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { AttackCostParamMgm } from './attack-cost-param-mgm.model';
import { AttackCostParamMgmService } from './attack-cost-param-mgm.service';

@Component({
    selector: 'jhi-attack-cost-param-mgm-detail',
    templateUrl: './attack-cost-param-mgm-detail.component.html'
})
export class AttackCostParamMgmDetailComponent implements OnInit, OnDestroy {

    attackCostParam: AttackCostParamMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private attackCostParamService: AttackCostParamMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInAttackCostParams();
    }

    load(id) {
        this.attackCostParamService.find(id)
            .subscribe((attackCostParamResponse: HttpResponse<AttackCostParamMgm>) => {
                this.attackCostParam = attackCostParamResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInAttackCostParams() {
        this.eventSubscriber = this.eventManager.subscribe(
            'attackCostParamListModification',
            (response) => this.load(this.attackCostParam.id)
        );
    }
}
