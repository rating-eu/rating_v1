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

import { LikelihoodScaleMgm } from './likelihood-scale-mgm.model';
import { LikelihoodScaleMgmService } from './likelihood-scale-mgm.service';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-likelihood-scale-mgm-detail',
    templateUrl: './likelihood-scale-mgm-detail.component.html'
})
export class LikelihoodScaleMgmDetailComponent implements OnInit, OnDestroy {

    likelihoodScale: LikelihoodScaleMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private likelihoodScaleService: LikelihoodScaleMgmService,
        private route: ActivatedRoute,
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInLikelihoodScales();
    }

    load(id) {
        this.likelihoodScaleService.find(id)
            .subscribe((likelihoodScaleResponse: HttpResponse<LikelihoodScaleMgm>) => {
                this.likelihoodScale = likelihoodScaleResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInLikelihoodScales() {
        this.eventSubscriber = this.eventManager.subscribe(
            'likelihoodScaleListModification',
            (response) => this.load(this.likelihoodScale.id)
        );
    }
}
