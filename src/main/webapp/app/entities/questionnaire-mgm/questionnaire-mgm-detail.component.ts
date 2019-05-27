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

import { QuestionnaireMgm } from './questionnaire-mgm.model';
import { QuestionnaireMgmService } from './questionnaire-mgm.service';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-questionnaire-mgm-detail',
    templateUrl: './questionnaire-mgm-detail.component.html'
})
export class QuestionnaireMgmDetailComponent implements OnInit, OnDestroy {

    questionnaire: QuestionnaireMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private questionnaireService: QuestionnaireMgmService,
        private route: ActivatedRoute,
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInQuestionnaires();
    }

    load(id) {
        this.questionnaireService.find(id)
            .subscribe((questionnaireResponse: HttpResponse<QuestionnaireMgm>) => {
                this.questionnaire = questionnaireResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInQuestionnaires() {
        this.eventSubscriber = this.eventManager.subscribe(
            'questionnaireListModification',
            (response) => this.load(this.questionnaire.id)
        );
    }
}
