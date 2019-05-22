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
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { AttackCostParamMgm } from './attack-cost-param-mgm.model';
import { AttackCostParamMgmService } from './attack-cost-param-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-attack-cost-param-mgm',
    templateUrl: './attack-cost-param-mgm.component.html'
})
export class AttackCostParamMgmComponent implements OnInit, OnDestroy {
attackCostParams: AttackCostParamMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private attackCostParamService: AttackCostParamMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.attackCostParamService.query().subscribe(
            (res: HttpResponse<AttackCostParamMgm[]>) => {
                this.attackCostParams = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    clear() {
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInAttackCostParams();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: AttackCostParamMgm) {
        return item.id;
    }
    registerChangeInAttackCostParams() {
        this.eventSubscriber = this.eventManager.subscribe('attackCostParamListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
