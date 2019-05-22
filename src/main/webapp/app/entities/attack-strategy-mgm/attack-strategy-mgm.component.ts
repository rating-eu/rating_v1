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

import { AttackStrategyMgm } from './attack-strategy-mgm.model';
import { AttackStrategyMgmService } from './attack-strategy-mgm.service';
import { Principal } from '../../shared';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';
import {Role} from '../enumerations/Role.enum';

@Component({
    selector: 'jhi-attack-strategy-mgm',
    templateUrl: './attack-strategy-mgm.component.html'
})
export class AttackStrategyMgmComponent implements OnInit, OnDestroy {
attackStrategies: AttackStrategyMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    public isADMIN: boolean;

    constructor(
        private attackStrategyService: AttackStrategyMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal,
        public popUpService: PopUpService
    ) {
    }

    loadAll() {
        this.attackStrategyService.query().subscribe(
            (res: HttpResponse<AttackStrategyMgm[]>) => {
                this.attackStrategies = res.body;
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
        this.principal.hasAnyAuthority([Role[Role.ROLE_ADMIN]]).then((response: boolean) => {
            if (response) {
                this.isADMIN = response;
            } else {
                this.isADMIN = false;
            }
        });
        this.registerChangeInAttackStrategies();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: AttackStrategyMgm) {
        return item.id;
    }
    registerChangeInAttackStrategies() {
        this.eventSubscriber = this.eventManager.subscribe('attackStrategyListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
