import {ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewRef} from '@angular/core';
import {GDPRQuestionnaireMgm} from '../../entities/gdpr-questionnaire-mgm';
import {DataOperationMgm, DataOperationMgmService} from '../../entities/data-operation-mgm';
import {GDPRQuestionnairePurpose} from '../../entities/enumerations/GDPRQuestionnairePurpose.enum';
import {GDPRQuestionMgm, GDPRQuestionMgmService} from '../../entities/gdpr-question-mgm';
import {Observable, Subscription} from 'rxjs';
import {HttpResponse} from '@angular/common/http';
import {FormGroup} from '@angular/forms';
import {DynamicQuestionnaireService} from './dynamic-questionnaire.service';
import {DataSharingService} from "../../data-sharing/data-sharing.service";
import {Router} from "@angular/router";
import {DataRecipientMgm} from "../../entities/data-recipient-mgm";
import {DataOperationField} from "../../entities/enumerations/gdpr/DataOperationField.enum";
import {DataRecipientType} from "../../entities/enumerations/gdpr/DataRecipientType.enum";

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

    public purposeEnum = GDPRQuestionnairePurpose;
    public dataOperationFieldEnum = DataOperationField;
    public dataRecipientTypeEnum = DataRecipientType;
    public dataRecipientTypes: DataRecipientType[];
    public form: FormGroup;

    constructor(private router: Router,
                private questionsService: GDPRQuestionMgmService,
                private dataOperationMgmService: DataOperationMgmService,
                private dynamicQuestionnaireService: DynamicQuestionnaireService,
                private dataSharingService: DataSharingService,
                private changeDetector: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.subscriptions = [];
        this.dataRecipientTypes = Object.keys(DataRecipientType).map((key) => DataRecipientType[key]);
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
            this.questionsService.getAllByQuestionnaire(this._questionnaire.id).toPromise().then(
                (response: HttpResponse<GDPRQuestionMgm[]>) => {
                    const questionsArray = response.body;

                    this.questions = questionsArray.sort((a, b) => {
                        return a.order - b.order;
                    });

                    this.form = this.dynamicQuestionnaireService.buildOperationContextForm(this.questions);
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

    ngOnChanges(changes: SimpleChanges): void {
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
}
