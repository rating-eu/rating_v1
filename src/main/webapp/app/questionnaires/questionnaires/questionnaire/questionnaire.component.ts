import {Component, OnInit} from '@angular/core';
import {QuestionnairesService} from '../../questionnaires.service';
import {QuestionnaireMgm} from '../../../entities/questionnaire-mgm';
import {QuestionMgm} from '../../../entities/question-mgm';
import {Observable} from 'rxjs/Observable';
import {DatasharingService} from '../../../datasharing/datasharing.service';
import {QuestionnaireStatusMgm} from '../../../entities/questionnaire-status-mgm';
import {Status} from '../../../entities/enumerations/QuestionnaireStatus.enum';
import {Router} from '@angular/router';
import {LocalStorageService} from 'ngx-webstorage';
import {QuestionnairePurpose} from '../../../entities/enumerations/QuestionnairePurpose.enum';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../../../entities/self-assessment-mgm';
import {AccountService, User, UserService} from '../../../shared';

window.onbeforeunload = function(evt) {
    console.log('before unload');
    const message = 'Are you sure you want to leave?';
    if (typeof evt === undefined) {
        evt = window.event;
    }
    if (evt) {
        evt.returnValue = message;

        console.log('Event');
        console.log(evt);
    }

    // window.location.href = 'http://localhost:9000/evaluate-weakness/questionnaires/SELFASSESSMENT';
    document.location.replace('http://localhost:9000/#/evaluate-weakness/questionnaires/SELFASSESSMENT');

    return message;
};

@Component({
    selector: 'jhi-questionnaire',
    templateUrl: './questionnaire.component.html',
    styles: [],
})
export class QuestionnaireComponent implements OnInit {

    private statusEnum = Status;
    questionnaire: QuestionnaireMgm;
    questions$: Observable<QuestionMgm[]>;
    questionnaireStatus: QuestionnaireStatusMgm;
    purpose: QuestionnairePurpose;
    selfAssessment: SelfAssessmentMgm;
    account: Account;
    user: User;
    private questionnaireStatuses: QuestionnaireStatusMgm[];
    private questionnaireStatusesMap: Map<number, QuestionnaireStatusMgm>;

    constructor(
        private questionnairesService: QuestionnairesService,
        private dataSharingService: DatasharingService,
        private selfAssessmentService: SelfAssessmentMgmService,
        private accountService: AccountService,
        private userService: UserService,
        private router: Router,
        private localStorage: LocalStorageService) {
    }

    ngOnInit() {
        this.questionnaire = this.dataSharingService.currentQuestionnaire;
        this.questionnaireStatus = this.dataSharingService.questionnaireStatus;

        if (!this.questionnaire && !this.questionnaireStatus) {
            this.purpose = this.localStorage.retrieve('purpose') as QuestionnairePurpose;

            if (this.purpose) {
                this.loadQuestionnaire();
            }
        }
    }

    private async loadQuestionnaire() {
        const questionnaires = await this.questionnairesService.getAllQuestionnairesByPurpose(this.purpose).toPromise();
        this.selfAssessment = await this.selfAssessmentService.getSelfAssessment();
        this.account = (await this.accountService.get().toPromise()).body;
        this.user = (await this.userService.find(this.account['login']).toPromise()).body;
        await this.setCurrentQuestionnaireAsyncVersion(questionnaires[0]);

        if (questionnaires) {
            this.dataSharingService.currentQuestionnaire = questionnaires[0];
            this.questionnaire = this.dataSharingService.currentQuestionnaire;
            this.questions$ = this.questionnairesService.getAllQuestionsByQuestionnaire(this.questionnaire);
        }
    }

    async setCurrentQuestionnaireAsyncVersion(questionnaire: QuestionnaireMgm) {
        if (!this.questionnaireStatusesMap) {
            this.questionnaireStatuses = await this.questionnairesService.getQuestionnaireStatusesBySelfAssessmentAndUser(this.selfAssessment, this.user).toPromise();
            this.questionnaireStatusesMap = new Map<number, QuestionnaireStatusMgm>();
            this.questionnaireStatuses.forEach((questionnaireStatus: QuestionnaireStatusMgm) => {
                this.questionnaireStatusesMap.set(questionnaireStatus.questionnaire.id, questionnaireStatus);
            });
            this.dataSharingService.questionnaireStatusesMap = this.questionnaireStatusesMap;
        } else {
            // TODO
        }
        this.dataSharingService.currentQuestionnaire = questionnaire;
        if (this.questionnaireStatusesMap.has(questionnaire.id)) {
            this.dataSharingService.questionnaireStatus = this.questionnaireStatusesMap.get(questionnaire.id);
        } else {
            const emptyQStatus: QuestionnaireStatusMgm = new QuestionnaireStatusMgm(undefined, Status.EMPTY, this.selfAssessment, questionnaire, this.user, questionnaire);
            this.dataSharingService.questionnaireStatus = emptyQStatus;
        }
        this.localStorage.store('purpose', this.purpose);
    }
}
