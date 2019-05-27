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

import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { MitigationMgm } from './mitigation-mgm.model';
import { MitigationMgmService } from './mitigation-mgm.service';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-mitigation-mgm-detail',
    templateUrl: './mitigation-mgm-detail.component.html'
})
export class MitigationMgmDetailComponent implements OnInit, OnDestroy, OnChanges {

    mitigation: MitigationMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;
    @Input('id') id: number;
    @Input('isButtonVisible') isButtonVisible;

    constructor(
        private eventManager: JhiEventManager,
        private mitigationService: MitigationMgmService,
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
        this.registerChangeInMitigations();
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
        this.mitigationService.find(id)
            .subscribe((mitigationResponse: HttpResponse<MitigationMgm>) => {
                this.mitigation = mitigationResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInMitigations() {
        this.eventSubscriber = this.eventManager.subscribe(
            'mitigationListModification',
            (response) => this.load(this.mitigation.id)
        );
    }
}
