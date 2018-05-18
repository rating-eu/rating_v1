import {Component, Input, OnInit} from '@angular/core';
import {QuestionnairesService} from '../../questionnaires.service';
import {QuestionnaireMgm} from '../../../entities/questionnaire-mgm';
import {QuestionMgm} from '../../../entities/question-mgm';
import {Observable} from 'rxjs/Observable';
import {DatasharingService} from '../../../datasharing/datasharing.service';
import {QuestionnaireStatusMgm} from '../../../entities/questionnaire-status-mgm';

@Component({
    selector: 'jhi-questionnaire',
    templateUrl: './questionnaire.component.html',
    styles: [],
})
export class QuestionnaireComponent implements OnInit {

    questionnaire: QuestionnaireMgm;
    questions$: Observable<QuestionMgm[]>;
    questionnaireStatus: QuestionnaireStatusMgm;

    constructor(private questionnairesService: QuestionnairesService, private dataSharingService: DatasharingService) {
    }

    ngOnInit() {
        this.questionnaire = this.dataSharingService.currentQuestionnaire;
        this.questionnaireStatus = this.dataSharingService.questionnaireStatus;

        console.log('QuestionnaireStatus: ' + this.questionnaireStatus.status);

        this.questions$ = this.questionnairesService.getAllQuestionsByQuestionnaire(this.questionnaire);
    }
}
