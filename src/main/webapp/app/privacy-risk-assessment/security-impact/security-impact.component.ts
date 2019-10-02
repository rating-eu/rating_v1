import {Component, OnInit} from '@angular/core';
import {DataSharingService} from "../../data-sharing/data-sharing.service";
import {GDPRQuestionnaireMgm, GDPRQuestionnaireMgmService} from "../../entities/gdpr-questionnaire-mgm";
import {GDPRQuestionMgm, GDPRQuestionMgmService} from "../../entities/gdpr-question-mgm";
import {Observable, Subscription} from "rxjs";
import {DataOperationMgm} from "../../entities/data-operation-mgm";
import {HttpResponse} from "@angular/common/http";
import {GDPRQuestionnairePurpose} from "../../entities/enumerations/GDPRQuestionnairePurpose.enum";
import {switchMap} from "rxjs/operators";

@Component({
    selector: 'jhi-security-impact',
    templateUrl: './security-impact.component.html',
    styles: []
})
export class SecurityImpactComponent implements OnInit {

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

        this.questionnaire$ = this.questionnaireService.findOneByPurpose(GDPRQuestionnairePurpose.IMPACT_EVALUATION);

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

}
