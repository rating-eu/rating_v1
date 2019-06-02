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

import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RiskBoardService, RiskBoardStatus} from '../risk-board.service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable, Subscription} from "rxjs";
import {Status} from "../../entities/enumerations/Status.enum";
import {RiskBoardStepEnum} from "../../entities/enumerations/RiskBoardStep.enum";
import {forkJoin} from "rxjs/observable/forkJoin";
import {SelfAssessmentMgm} from "../../entities/self-assessment-mgm";
import {DatasharingService} from "../../datasharing/datasharing.service";
import {ImpactMode} from "../../entities/enumerations/ImpactMode.enum";
import {switchMap} from "rxjs/operators";
import {of} from "rxjs/observable/of";

@Component({
    selector: 'jhi-step-info-widget',
    templateUrl: './step-info-widget.component.html',
    styleUrls: ['step-info-widget.component.css']
})
export class StepInfoWidgetComponent implements OnInit, OnDestroy {
    public loading = false;

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

    private subscriptions: Subscription[];

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
        this.subscriptions = [];
        this.selfAssessment = this.datasharingService.selfAssessment;

        if (!this.selfAssessment) {
            this.router.navigate(['/my-risk-assessments']);
        } else {
            this.fetchStatus$()
                .toPromise()
                .then((response: [Status, Status, Status, Status] | null) => {
                    this.handleStatusUpdate(response);
                });
        }

        this.subscriptions.push(
            this.datasharingService.selfAssessmentObservable.pipe(
                switchMap((newAssessment: SelfAssessmentMgm) => {

                    if (newAssessment) {
                        // Check if there is no self assessment or if it has changed
                        if (!this.selfAssessment || this.selfAssessment.id !== newAssessment.id) {
                            this.selfAssessment = newAssessment;

                            return this.fetchStatus$()
                                .catch((err) => {
                                    return forkJoin(of(Status.EMPTY), of(Status.EMPTY), of(Status.EMPTY), of(Status.EMPTY));
                                });
                        }
                    } else {
                        return forkJoin(of(Status.EMPTY), of(Status.EMPTY), of(Status.EMPTY), of(Status.EMPTY));
                    }
                })
            ).subscribe((response: [Status, Status, Status, Status]) => {
                this.handleStatusUpdate(response);
            })
        );
    }


    private handleStatusUpdate(response: [Status, Status, Status, Status] | null) {
        if (response) {
            this.assetClusteringStatus = response[0];
            this.impactEvaluationStatus = response[1];
            this.attackRelatedCostsStatus = response[2];
            this.riskEvaluationStatus = response[3];
        } else {
            this.assetClusteringStatus = Status.EMPTY;
            this.impactEvaluationStatus = Status.EMPTY;
            this.attackRelatedCostsStatus = Status.EMPTY;
            this.riskEvaluationStatus = Status.EMPTY;
        }

        this.riskBoardStatus.assetClusteringStatus = this.assetClusteringStatus;
        this.riskBoardStatus.impactEvaluationStatus = this.impactEvaluationStatus;
        this.riskBoardStatus.attackRelatedCostEstimationStatus = this.attackRelatedCostsStatus;
        this.riskBoardStatus.riskEvaluationStatus = this.riskEvaluationStatus;

        this.datasharingService.riskBoardStatus = this.riskBoardStatus;

        if (this.changeDetector) {
            this.changeDetector.detectChanges();
        }
    }

    private fetchStatus$(): Observable<[Status, Status, Status, Status]> {
        // Reset the Statuses
        this.riskBoardStatus = new RiskBoardStatus();
        this.datasharingService.riskBoardStatus = this.riskBoardStatus;

        this.assetClusteringStatus$ = this.riskBoardService.getStatusFromServer(this.selfAssessment, RiskBoardStepEnum.ASSET_CLUSTERING)
            .catch((err) => {
                return of(Status.EMPTY);
            });
        this.impactEvaluationStatus$ = this.riskBoardService.getStatusFromServer(this.selfAssessment, RiskBoardStepEnum.IMPACT_EVALUATION)
            .catch((err) => {
                return of(Status.EMPTY);
            });
        this.attackRelatedCostsStatus$ = this.riskBoardService.getStatusFromServer(this.selfAssessment, RiskBoardStepEnum.ATTACK_RELATED_COSTS)
            .catch((err) => {
                return of(Status.EMPTY);
            });
        this.riskEvaluationStatus$ = this.riskBoardService.getStatusFromServer(this.selfAssessment, RiskBoardStepEnum.RISK_EVALUATION)
            .catch((err) => {
                return of(Status.EMPTY);
            });

        const join$: Observable<[Status, Status, Status, Status]> = forkJoin(this.assetClusteringStatus$,
            this.impactEvaluationStatus$, this.attackRelatedCostsStatus$, this.riskEvaluationStatus$)
            .catch(err => {
                return forkJoin(of(Status.EMPTY), of(Status.EMPTY), of(Status.EMPTY), of(Status.EMPTY));
            });

        return join$;
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

    ngOnDestroy(): void {
        this.changeDetector.detach();

        if (this.subscriptions && this.subscriptions.length) {
            this.subscriptions.forEach((subscription) => {
                subscription.unsubscribe();
            });
        }
    }
}
