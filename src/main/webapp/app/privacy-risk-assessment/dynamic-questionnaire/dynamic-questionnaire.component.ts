import {ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewRef} from '@angular/core';
import {GDPRQuestionnaireMgm} from '../../entities/gdpr-questionnaire-mgm';
import {DataOperationMgm, DataOperationMgmService} from '../../entities/data-operation-mgm';
import {GDPRQuestionnairePurpose} from '../../entities/enumerations/GDPRQuestionnairePurpose.enum';
import {GDPRQuestionMgm, GDPRQuestionMgmService} from '../../entities/gdpr-question-mgm';
import {Observable, Subscription} from 'rxjs';
import {HttpResponse} from '@angular/common/http';
import {FormGroup} from '@angular/forms';
import {DynamicQuestionnaireService} from './dynamic-questionnaire.service';
import {DataSharingService} from '../../data-sharing/data-sharing.service';
import {Router} from '@angular/router';
import {DataRecipientMgm} from '../../entities/data-recipient-mgm';
import {DataOperationField} from '../../entities/enumerations/gdpr/DataOperationField.enum';
import {DataRecipientType} from '../../entities/enumerations/gdpr/DataRecipientType.enum';
import {SecurityImpactMgm} from '../../entities/security-impact-mgm';
import {SecurityPillar} from '../../entities/enumerations/gdpr/SecurityPillar.enum';
import {ThreatArea} from "../../entities/enumerations/gdpr/ThreatArea.enum";
import {GDPRQuestionnaireStatusMgm} from "../../entities/gdpr-questionnaire-status-mgm";
import {GDPRMyAnswerMgm} from "../../entities/gdpr-my-answer-mgm";

@Component({
    selector: 'jhi-dynamic-questionnaire',
    templateUrl: './dynamic-questionnaire.component.html',
    styleUrls: ['dynamic-questionnaire.css']
})
export class DynamicQuestionnaireComponent implements OnInit, OnChanges, OnDestroy {

    private subscriptions: Subscription[];

    // Properties
    private _dataOperation: DataOperationMgm;
    private _questionnaire: GDPRQuestionnaireMgm;
    private _questions: GDPRQuestionMgm[];

    public questionsByThreatAreaMap: Map<ThreatArea, GDPRQuestionMgm[]>;

    public purposeEnum = GDPRQuestionnairePurpose;
    public dataOperationFieldEnum = DataOperationField;
    public dataRecipientTypes: DataRecipientType[];
    public form: FormGroup;

    public securityPillarEnum = SecurityPillar;
    public securityPillars: SecurityPillar[];
    public securityImpactsMap: Map<SecurityPillar, SecurityImpactMgm>;

    public threatAreaEnum = ThreatArea;
    public threatAreas: ThreatArea[];
    private threatAreasQuestionnaireStatus: GDPRQuestionnaireStatusMgm;
    public threatAreasMyAnswersMap: Map<number/*QuestionID*/, GDPRMyAnswerMgm>;

    constructor(private router: Router,
                private questionService: GDPRQuestionMgmService,
                private questionnaireStatusService: GDPRQuestionnaireStatusMgm,
                private dataOperationMgmService: DataOperationMgmService,
                private dynamicQuestionnaireService: DynamicQuestionnaireService,
                private dataSharingService: DataSharingService,
                private changeDetector: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.subscriptions = [];
        this.dataRecipientTypes = Object.keys(DataRecipientType).map((key) => DataRecipientType[key]);

        this.securityPillars = Object.keys(SecurityPillar).map((key) => SecurityPillar[key]);
        this.securityImpactsMap = new Map();

        this.threatAreas = Object.keys(ThreatArea).map((key) => ThreatArea[key]);
        this.threatAreasMyAnswersMap = new Map();
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('Dynamic Questionnaire OnChanges...');

        if (this._dataOperation && this._questionnaire) {
            const purpose: GDPRQuestionnairePurpose = this._questionnaire.purpose;

            switch (purpose) {
                case GDPRQuestionnairePurpose.OPERATION_CONTEXT: {

                    break;
                }
                case GDPRQuestionnairePurpose.IMPACT_EVALUATION: {
                    console.log('Case ImpactEvaluation...');

                    if (this.dataOperation.impacts && this.dataOperation.impacts.length) {
                        this.dataOperation.impacts.forEach((impact: SecurityImpactMgm) => {
                            this.securityImpactsMap.set(impact.securityPillar, impact);
                        });

                        this.securityPillars.forEach((securityPillar: SecurityPillar) => {
                            if (this.securityImpactsMap.has(securityPillar)) {
                                // Ok, do nothing!
                            } else {
                                // Create the missing SecurityImpact
                                const securityImpact: SecurityImpactMgm = new SecurityImpactMgm(undefined, securityPillar);

                                this.dataOperation.impacts.push(securityImpact);
                                this.securityImpactsMap.set(securityPillar, securityImpact);
                            }
                        });
                    } else {
                        // Initialize the SecurityImpacts
                        this.dataOperation.impacts = [];

                        this.securityPillars.forEach((securityPillar: SecurityPillar) => {
                            // Create the missing SecurityImpact
                            const securityImpact: SecurityImpactMgm = new SecurityImpactMgm(undefined, securityPillar);

                            this.dataOperation.impacts.push(securityImpact);
                            this.securityImpactsMap.set(securityPillar, securityImpact);
                        });
                    }

                    console.log('SecurityImpactsMap:');
                    console.log('Keys.length: ' + this.securityImpactsMap.size);

                    break;
                }
                case GDPRQuestionnairePurpose.THREAT_LIKELIHOOD: {
                    console.log('Case Threat Likelihood...');

                    if(this._dataOperation && !this.threatAreasQuestionnaireStatus){
                        // TODO 0: Create the API Get the QuestionnaireStatus by DataOperation
                        // TODO 1: Get the QuestionnaireStatus by DataOperation
                        // TODO 2: Build the MapOfMyAnswers referencing the Answers of the QuestionnaireStatus
                        // TODO 3: Do the binding with the form radio buttons


                    }

                    break;
                }
            }
        }
    }

    public submitOperationContext() {
        let dataOperation$: Observable<HttpResponse<DataOperationMgm>>;

        if (this.dataOperation.id) {
            dataOperation$ = this.dataOperationMgmService.update(this.dataOperation);
        } else {
            dataOperation$ = this.dataOperationMgmService.create(this.dataOperation);
        }

        this.subscriptions.push(
            dataOperation$.subscribe((operationResponse: HttpResponse<DataOperationMgm>) => {
                this.dataOperation = operationResponse.body;
                this.dataSharingService.dataOperation = this.dataOperation;

                this.router.navigate(['/privacy-board']);
            })
        );
    }

    public submitSecurityImpacts() {
        console.log('Submit SecurityImpacts...');

        if (this._dataOperation.impacts && this.dataOperation.impacts.length) {
            console.log('Impacts are set on the DataOperation...');
        }

        if (this._dataOperation.impacts && this.dataOperation.impacts.length) {
            if (this.dataOperation.id) {
                this.dataOperationMgmService.update(this._dataOperation).toPromise()
                    .then(
                        (operationResponse: HttpResponse<DataOperationMgm>) => {
                            this._dataOperation = operationResponse.body;
                            this.dataSharingService.dataOperation = this._dataOperation;

                            this.router.navigate(['/privacy-board']);
                        }
                    );
            } else {
                // To perform this step a DataOperation must already exist.
            }
        }
    }

    public submitThreatLikelihood() {

    }

    @Input()
    set dataOperation(dataOperation: DataOperationMgm) {
        this._dataOperation = dataOperation;
        this.detectChanges();
    }

    get dataOperation(): DataOperationMgm {
        return this._dataOperation;
    }

    @Input()
    set questionnaire(questionnaire: GDPRQuestionnaireMgm) {
        this._questionnaire = questionnaire;

        if (this._questionnaire) {
            this.questionService.getAllByQuestionnaire(this._questionnaire.id).toPromise().then(
                (response: HttpResponse<GDPRQuestionMgm[]>) => {
                    const questionsArray = response.body;

                    this.questions = questionsArray.sort((a, b) => {
                        return a.order - b.order;
                    });

                    switch (this._questionnaire.purpose) {
                        case GDPRQuestionnairePurpose.OPERATION_CONTEXT: {
                            this.form = this.dynamicQuestionnaireService.buildOperationContextForm(this.dataOperation, this.questions);

                            break;
                        }
                        case GDPRQuestionnairePurpose.IMPACT_EVALUATION: {
                            this.form = this.dynamicQuestionnaireService.buildImpactEvaluationForm(this.dataOperation, this.questions);

                            break;
                        }
                        case GDPRQuestionnairePurpose.THREAT_LIKELIHOOD: {
                            this.form = this.dynamicQuestionnaireService.buildThreatLikelihoodForm(this.dataOperation, this.questions);

                            this.questionsByThreatAreaMap = new Map();

                            this.threatAreas.forEach((area: ThreatArea) => {
                                this.questionsByThreatAreaMap.set(area, []);
                            });

                            this._questions.forEach((question: GDPRQuestionMgm) => {
                                const area: ThreatArea = question.threatArea;

                                switch (area) {
                                    case ThreatArea.NETWORK_AND_TECHNICAL_RESOURCES:
                                    case ThreatArea.PROCEDURES_RELATED_TO_THE_PROCESSING_OF_PERSONAL_DATA:
                                    case ThreatArea.PEOPLE_INVOLVED_IN_THE_PROCESSING_OF_PERSONAL_DATA:
                                    case ThreatArea.BUSINESS_SECTOR_AND_SCALE_OF_PROCESSING: {
                                        this.questionsByThreatAreaMap.get(area).push(question);
                                        break;
                                    }
                                }
                            });

                            break;
                        }
                    }
                }
            );

            this.detectChanges();
        }
    }

    get questionnaire(): GDPRQuestionnaireMgm {
        return this._questionnaire;
    }

    set questions(questions: GDPRQuestionMgm[]) {
        this._questions = questions;
    }

    get questions(): GDPRQuestionMgm[] {
        return this._questions;
    }

    private detectChanges() {
        if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
            this.changeDetector.detectChanges();
        }
    }

    public isValid(questionID) {
        return this.form.controls[questionID].valid;
    }

    public trackByID(index, question: GDPRQuestionMgm) {
        return question.id;
    }

    ngOnDestroy(): void {
        this.changeDetector.detach();

        if (this.subscriptions && this.subscriptions.length) {
            this.subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            });
        }
    }

    back() {
        this.router.navigate(['/privacy-board']);
    }

    addRecipient() {
        if (this.dataOperation && this.form) {
            if (!this.dataOperation.recipients) {
                this.dataOperation.recipients = [];
            }

            this.dataOperation.recipients.push(new DataRecipientMgm());
            this.dynamicQuestionnaireService.addDataRecipient(this.form);

            this.detectChanges();
        }
    }

    removeRecipient(index: number) {
        if (this.dataOperation && this.form) {
            if (this.dataOperation.recipients) {
                const removed: DataRecipientMgm[] = this.dataOperation.recipients.splice(index, 1);
                this.dynamicQuestionnaireService.removeRecipient(this.form, index);

                this.detectChanges();
            }
        }
    }
}
