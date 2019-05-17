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

import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {JhiAlertService, JhiEventManager} from 'ng-jhipster';

import {AnswerWeightMgm} from './answer-weight-mgm.model';
import {AnswerWeightMgmService} from './answer-weight-mgm.service';
import {Principal} from '../../shared';
import {MatTabChangeEvent} from '@angular/material';
import {PopUpService} from '../../shared/pop-up-services/pop-up.service';
import {QuestionType} from "../enumerations/QuestionType.enum";

@Component({
    selector: 'jhi-answer-weight-mgm',
    templateUrl: './answer-weight-mgm.component.html'
})
export class AnswerWeightMgmComponent implements OnInit, OnDestroy {
    allAnswerWeights: AnswerWeightMgm[];
    regularAnswerWeights: AnswerWeightMgm[];
    relevantAnswerWeights: AnswerWeightMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(private answerWeightService: AnswerWeightMgmService,
                private jhiAlertService: JhiAlertService,
                private eventManager: JhiEventManager,
                private activatedRoute: ActivatedRoute,
                private principal: Principal,
                public popUpService: PopUpService) {
    }

    loadAll() {
        this.answerWeightService.query().subscribe(
            (res: HttpResponse<AnswerWeightMgm[]>) => {
                this.allAnswerWeights = res.body;
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
        this.registerChangeInAnswerWeights();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: AnswerWeightMgm) {
        return item.id;
    }

    registerChangeInAnswerWeights() {
        this.eventSubscriber = this.eventManager.subscribe('answerWeightListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

    tabClick(event: MatTabChangeEvent) {
        switch (event.tab.textLabel) {
            case '': {
                if (!this.allAnswerWeights || !this.allAnswerWeights.length) {
                    this.answerWeightService.query().subscribe(
                        (response: HttpResponse<AnswerWeightMgm[]>) => {
                            this.allAnswerWeights = response.body;
                        }
                    );
                }

                break;
            }
            case 'Regular': {
                if (!this.regularAnswerWeights || !this.regularAnswerWeights.length) {
                    this.answerWeightService.findAllByQuestionType(QuestionType.REGULAR).subscribe(
                        (response: HttpResponse<AnswerWeightMgm[]>) => {
                            this.regularAnswerWeights = response.body;
                        }
                    );
                }

                break;
            }
            case 'Relevant': {
                if (!this.relevantAnswerWeights || !this.relevantAnswerWeights.length) {
                    this.answerWeightService.findAllByQuestionType(QuestionType.RELEVANT).subscribe(
                        (response: HttpResponse<AnswerWeightMgm[]>) => {
                            this.relevantAnswerWeights = response.body;
                        }
                    );
                }
                
                break;
            }
        }
    }
}
