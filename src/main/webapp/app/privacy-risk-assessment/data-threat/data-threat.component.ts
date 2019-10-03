import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {DataOperationMgm} from "../../entities/data-operation-mgm";
import {GDPRQuestionnaireMgm, GDPRQuestionnaireMgmService} from "../../entities/gdpr-questionnaire-mgm";
import {HttpResponse} from "@angular/common/http";
import {GDPRQuestionMgm, GDPRQuestionMgmService} from "../../entities/gdpr-question-mgm";
import {DataSharingService} from "../../data-sharing/data-sharing.service";
import {GDPRQuestionnairePurpose} from "../../entities/enumerations/GDPRQuestionnairePurpose.enum";
import {switchMap} from "rxjs/operators";

@Component({
    selector: 'jhi-data-threat',
    templateUrl: './data-threat.component.html',
    styles: []
})
export class DataThreatComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[];
    public dataOperation: DataOperationMgm;

    public questionnaire: GDPRQuestionnaireMgm;
    private questionnaire$: Observable<HttpResponse<GDPRQuestionnaireMgm>>;

    public questions: GDPRQuestionMgm[];
    private questions$: Observable<HttpResponse<GDPRQuestionMgm[]>>;

    constructor(private dataSharingService: DataSharingService,
                private questionnaireService: GDPRQuestionnaireMgmService,
                private questionsService: GDPRQuestionMgmService) {
    }

    ngOnInit() {
        this.subscriptions = [];

        this.dataOperation = this.dataSharingService.dataOperation;

        this.subscriptions.push(
            this.dataSharingService.dataOperation$.subscribe(
                (dataOperation: DataOperationMgm) => {
                    this.dataOperation = dataOperation;
                }
            )
        );

        this.questionnaire$ = this.questionnaireService.findOneByPurpose(GDPRQuestionnairePurpose.THREAT_LIKELIHOOD);

        this.questions$ = this.questionnaire$.pipe(
            switchMap((questionnaireResponse: HttpResponse<GDPRQuestionnaireMgm>) => {
                this.questionnaire = questionnaireResponse.body;

                return this.questionsService.getAllByQuestionnaire(this.questionnaire.id);
            })
        );


        this.subscriptions.push(
            this.questions$.subscribe((questionsResponse: HttpResponse<GDPRQuestionMgm[]>) => {
                this.questions = questionsResponse.body;
            })
        )
    }

    ngOnDestroy(): void {
        if (this.subscriptions && this.subscriptions.length) {
            this.subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            });
        }
    }
}
