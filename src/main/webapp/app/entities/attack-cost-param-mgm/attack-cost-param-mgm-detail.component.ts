/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

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
