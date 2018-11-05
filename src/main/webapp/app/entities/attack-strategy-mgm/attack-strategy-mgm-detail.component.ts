import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
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
export class AttackStrategyMgmDetailComponent implements OnInit, OnDestroy, OnChanges {

    attackStrategy: AttackStrategyMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;
    @Input('id') id: number;
    @Input('isButtonVisible') isButtonVisible;

    constructor(
        private eventManager: JhiEventManager,
        private attackStrategyService: AttackStrategyMgmService,
        private route: ActivatedRoute,
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            if (params['id']) {
                this.load(params['id']);
                this.isButtonVisible = true;
            }
        });
        if (this.id) {
            this.load(this.id);
        }
        this.registerChangeInAttackStrategies();
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (propName) {
                const change = changes[propName];
                const curVal = change.currentValue;
                const prevVal = change.previousValue;
                if (propName === 'id') {
                    this.id = curVal as number;
                    this.load(this.id);
                }
                if (propName === 'isButtonVisible') {
                    this.isButtonVisible = curVal as boolean;
                }
            }
        }
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
