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

import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RiskBoardService, RiskBoardStatus} from '../risk-board.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from "rxjs";
import {Status} from "../../entities/enumerations/Status.enum";
import {RiskBoardStepEnum} from "../../entities/enumerations/RiskBoardStep.enum";
import {forkJoin} from "rxjs/observable/forkJoin";
import {SelfAssessmentMgm} from "../../entities/self-assessment-mgm";
import {DatasharingService} from "../../datasharing/datasharing.service";
import {ImpactMode} from "../../entities/enumerations/ImpactMode.enum";

@Component({
    selector: 'jhi-step-info-widget',
    templateUrl: './step-info-widget.component.html',
    styleUrls: ['step-info-widget.component.css']
})
export class StepInfoWidgetComponent implements OnInit {
    public loading = false;
    public isCollapsed = false;

    public selfAssessment: SelfAssessmentMgm = null;
    public statusEnum = Status;
    public impactModeEnum = ImpactMode;

    private riskBoardStatus: RiskBoardStatus = null;

    private assetClusteringStatus$: Observable<Status>;
    private assetClusteringStatus: Status;

    private impactEvaluationStatus$: Observable<Status>;
    private impactEvaluationStatus: Status;

    private attackRelatedCostsStatus$: Observable<Status>;
    private attackRelatedCostsStatus: Status;

    private riskEvaluationStatus$: Observable<Status>;
    private riskEvaluationStatus: Status;

    public alertMessage: string;

    private closeResult: string;
    private linkAfterModal: string;

    constructor(
        private datasharingService: DatasharingService,
        private dashService: RiskBoardService,
        private modalService: NgbModal,
        private router: Router,
        private riskBoardService: RiskBoardService,
        private changeDetector: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        this.selfAssessment = this.datasharingService.selfAssessment;

        if (!this.selfAssessment) {
            this.router.navigate(['/my-risk-assessments']);
        }else{
            this.fetchStatus();
        }

        this.datasharingService.selfAssessmentObservable.subscribe(assessment => {
            if (!assessment || this.selfAssessment.id !== assessment.id) {
                this.selfAssessment = assessment;

                if (!this.selfAssessment) {
                    this.router.navigate(['/my-risk-assessments']);
                }else{
                    this.fetchStatus();
                }
            }
        });
    }


    private fetchStatus() {
        this.riskBoardStatus = new RiskBoardStatus();
        this.datasharingService.riskBoardStatus = this.riskBoardStatus;

        if(this.changeDetector){
            this.changeDetector.detectChanges();
        }

        this.assetClusteringStatus$ = this.riskBoardService.getStatusFromServer(this.selfAssessment, RiskBoardStepEnum.ASSET_CLUSTERING);
        this.impactEvaluationStatus$ = this.riskBoardService.getStatusFromServer(this.selfAssessment, RiskBoardStepEnum.IMPACT_EVALUATION);
        this.attackRelatedCostsStatus$ = this.riskBoardService.getStatusFromServer(this.selfAssessment, RiskBoardStepEnum.ATTACK_RELATED_COSTS);
        this.riskEvaluationStatus$ = this.riskBoardService.getStatusFromServer(this.selfAssessment, RiskBoardStepEnum.RISK_EVALUATION);

        const join$: Observable<[Status, Status, Status, Status]> = forkJoin(this.assetClusteringStatus$,
            this.impactEvaluationStatus$, this.attackRelatedCostsStatus$, this.riskEvaluationStatus$);

        join$.subscribe((response: [Status, Status, Status, Status]) => {
            this.assetClusteringStatus = response[0];
            this.impactEvaluationStatus = response[1];
            this.attackRelatedCostsStatus = response[2];
            this.riskEvaluationStatus = response[3];

            this.riskBoardStatus.assetClusteringStatus = this.assetClusteringStatus;
            this.riskBoardStatus.impactEvaluationStatus = this.impactEvaluationStatus;
            this.riskBoardStatus.attackRelatedCostEstimationStatus = this.attackRelatedCostsStatus;
            this.riskBoardStatus.riskEvaluationStatus = this.riskEvaluationStatus;

            this.datasharingService.riskBoardStatus = this.riskBoardStatus;

            if(this.changeDetector){
                this.changeDetector.detectChanges();
            }
        });
    }

    open(content, link, message?) {
        this.linkAfterModal = link;
        if (message) {
            this.alertMessage = message;
        } else {
            this.alertMessage = null;
        }
        this.modalService.open(content, {}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
            if (this.linkAfterModal) {
                this.router.navigate([this.linkAfterModal]);
            } else {
                console.log('WORK IN PROGRESS');
            }
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
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
}
