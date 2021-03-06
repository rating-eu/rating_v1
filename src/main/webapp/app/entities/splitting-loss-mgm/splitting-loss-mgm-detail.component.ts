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

import { SplittingLossMgm } from './splitting-loss-mgm.model';
import { SplittingLossMgmService } from './splitting-loss-mgm.service';
import {PopUpService} from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-splitting-loss-mgm-detail',
    templateUrl: './splitting-loss-mgm-detail.component.html'
})
export class SplittingLossMgmDetailComponent implements OnInit, OnDestroy {

    splittingLoss: SplittingLossMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private splittingLossService: SplittingLossMgmService,
        private route: ActivatedRoute,
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInSplittingLosses();
    }

    load(id) {
        this.splittingLossService.find(id)
            .subscribe((splittingLossResponse: HttpResponse<SplittingLossMgm>) => {
                this.splittingLoss = splittingLossResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSplittingLosses() {
        this.eventSubscriber = this.eventManager.subscribe(
            'splittingLossListModification',
            (response) => this.load(this.splittingLoss.id)
        );
    }
}
