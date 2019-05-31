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

import * as _ from 'lodash';
import {RiskBoardStepEnum} from '../../entities/enumerations/RiskBoardStep.enum';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../../entities/self-assessment-mgm';
import {MyAnswerMgm, MyAnswerMgmService} from '../../entities/my-answer-mgm';
import {QuestionMgm, QuestionMgmService} from '../../entities/question-mgm';
import {QuestionnaireStatusMgm, QuestionnaireStatusMgmService} from '../../entities/questionnaire-status-mgm';
import {HttpResponse} from '@angular/common/http';
import {MotivationMgm, MotivationMgmService} from '../../entities/motivation-mgm';
import {ThreatAgentMgm, ThreatAgentMgmService} from '../../entities/threat-agent-mgm';
import {mergeMap, switchMap} from 'rxjs/operators';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {Couple} from '../../utils/couple.class';
import {Fraction} from '../../utils/fraction.class';
import {SkillLevel} from '../../entities/enumerations/SkillLevel.enum';
import {Observable, Subscription} from 'rxjs';
import {QuestionnaireMgm} from '../../entities/questionnaire-mgm';
import {BaseEntity} from '../../shared';
import {AnswerMgm} from '../../entities/answer-mgm';
import * as CryptoJS from 'crypto-js';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RiskBoardService, RiskBoardStatus} from '../../risk-board/risk-board.service';
import {DatasharingService} from "../../datasharing/datasharing.service";
import {MyCompanyMgm} from "../../entities/my-company-mgm";
import {QuestionnairePurpose} from "../../entities/enumerations/QuestionnairePurpose.enum";
import {ThreatAgentInterestService} from "../../entities/threat-agent-interest/threat-agent-interest.service";
import {ThreatAgentInterest} from "../../entities/threat-agent-interest/threat-agent-interest.model";

interface OrderBy {
    threatAgents: boolean;
    skills: boolean;
    interest: boolean;
    type: string;
}

@Component({
    selector: 'jhi-threat-agents-widget',
    templateUrl: './threat-agents-widget.component.html',
    styleUrls: ['threat-agents-widget.component.css']
})
export class ThreatAgentsWidgetComponent implements OnInit, OnDestroy {
    private closeResult: string;

    private subscriptions: Subscription[] = [];

    public selectedThreatAgent: ThreatAgentMgm = null;
    private myCompany: MyCompanyMgm;

    public loading = false;
    public orderBy: OrderBy;

    // Company ThreatAgents
    private threatAgentInterests$: Observable<ThreatAgentInterest[]>;
    public threatAgentInterests: ThreatAgentInterest[];

    constructor(
        private selfAssessmentService: SelfAssessmentMgmService,
        private myAnswerService: MyAnswerMgmService,
        private questionService: QuestionMgmService,
        private questionnaireStatusService: QuestionnaireStatusMgmService,
        private motivationsService: MotivationMgmService,
        private threatAgentService: ThreatAgentMgmService,
        private threatAgentInterestService: ThreatAgentInterestService,
        private modalService: NgbModal,
        private dataSharingService: DatasharingService
    ) {
    }

    ngOnInit() {
        this.loading = true;
        this.orderBy = {
            threatAgents: false,
            skills: false,
            interest: false,
            type: 'desc'
        };

        // The below code is been copy and customized from the resul.component of the identify-threat-agents module
        this.myCompany = this.dataSharingService.myCompany;
        this.callAPI();

        this.subscriptions.push(
            this.dataSharingService.myCompanyObservable.subscribe(
                (response: MyCompanyMgm) => {
                    this.myCompany = response;
                    this.callAPI();
                }
            )
        );
    }

    private callAPI() {
        if (this.myCompany && this.myCompany.companyProfile) {
            this.threatAgentInterests$ = this.threatAgentInterestService.getThreatAgentsInterestsByCompanyProfile(this.myCompany.companyProfile);

            this.threatAgentInterests$.subscribe((response: ThreatAgentInterest[]) => {
                this.threatAgentInterests = response;
                this.loading = false;
            });
        }else {
            this.loading = false;
        }
    }

    ngOnDestroy() {
        if (this.subscriptions) {
            this.subscriptions.forEach((subscription: Subscription) => {
                if (subscription) {
                    subscription.unsubscribe();
                }
            });
        }
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    open(content) {
        this.modalService.open(content, {size: 'lg'}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    public selectThreatAgent(threatAgent: ThreatAgentMgm) {
        if (this.selectedThreatAgent) {
            if (this.selectedThreatAgent.id === threatAgent.id) {
                this.selectedThreatAgent = null;
            } else {
                this.selectedThreatAgent = threatAgent;
            }
        } else {
            this.selectedThreatAgent = threatAgent;
        }
    }

    private resetOrder() {
        this.orderBy.threatAgents = false;
        this.orderBy.skills = false;
        this.orderBy.interest = false;
        this.orderBy.type = 'desc';
    }

    public tableOrderBy(orderColumn: string, desc: boolean) {
        this.resetOrder();
        if (desc) {
            this.orderBy.type = 'desc';
        } else {
            this.orderBy.type = 'asc';
        }
        switch (orderColumn.toLowerCase()) {
            case ('threat_agents'): {
                this.orderBy.threatAgents = true;
                if (desc) {
                    this.threatAgentInterests = _.orderBy(this.threatAgentInterests, (elem: ThreatAgentInterest) => elem.name, ['desc']);
                } else {
                    this.threatAgentInterests = _.orderBy(this.threatAgentInterests, (elem: ThreatAgentInterest) => elem.name, ['asc']);
                }
                break;
            }
            case ('skills'): {
                this.orderBy.skills = true;
                if (desc) {
                    this.threatAgentInterests = _.orderBy(this.threatAgentInterests, (elem: ThreatAgentInterest) => elem.skillLevel, ['desc']);
                } else {
                    this.threatAgentInterests = _.orderBy(this.threatAgentInterests, (elem: ThreatAgentInterest) => elem.skillLevel, ['asc']);
                }
                break;
            }
            case ('interest'): {
                this.orderBy.interest = true;
                if (desc) {
                    this.threatAgentInterests = _.orderBy(this.threatAgentInterests, (elem: ThreatAgentInterest) => elem.levelOfInterest, ['desc']);
                } else {
                    this.threatAgentInterests = _.orderBy(this.threatAgentInterests, (elem: ThreatAgentInterest) => elem.levelOfInterest, ['asc']);
                }
                break;
            }
        }
    }
}
