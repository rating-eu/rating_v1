import { Component, Input, OnInit } from '@angular/core';
import { QuestionnairesService } from '../../questionnaires.service';
import { QuestionnaireMgm } from '../../../entities/questionnaire-mgm';
import { QuestionMgm } from '../../../entities/question-mgm';
import { Observable } from 'rxjs/Observable';
import { DatasharingService } from '../../../datasharing/datasharing.service';
import { QuestionnaireStatusMgm } from '../../../entities/questionnaire-status-mgm';
import { Status } from '../../../entities/enumerations/QuestionnaireStatus.enum';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

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

    constructor(
        private questionnairesService: QuestionnairesService,
        private dataSharingService: DatasharingService,
        private router: Router,
        private localStorage: LocalStorageService) {
    }

    ngOnInit() {
        this.questionnaire = this.dataSharingService.currentQuestionnaire;
        this.questionnaireStatus = this.dataSharingService.questionnaireStatus;
        if (!this.questionnaire && !this.questionnaireStatus) {
            const purpose = this.localStorage.retrieve('purpose');
            this.router.navigate(['./identify-threat-agent/questionnaires/' + purpose]);
        }
        console.log('QuestionnaireStatus: ' + this.questionnaireStatus);

        this.questions$ = this.questionnairesService.getAllQuestionsByQuestionnaire(this.questionnaire);
    }
}
