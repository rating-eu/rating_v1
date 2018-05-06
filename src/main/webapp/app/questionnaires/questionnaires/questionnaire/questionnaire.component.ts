import {Component, Input, OnInit} from '@angular/core';
import {QuestionnairesService} from '../../questionnaires.service';
import {QuestionnaireMgm} from '../../../entities/questionnaire-mgm';
import {QuestionMgm} from '../../../entities/question-mgm';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'jhi-questionnaire',
    templateUrl: './questionnaire.component.html',
    styles: [],
})
export class QuestionnaireComponent implements OnInit {

    private questionnaire: QuestionnaireMgm;
    questions: QuestionMgm[];

    constructor(private questionnairesService: QuestionnairesService) {
    }

    ngOnInit() {
        this.questionnaire = this.questionnairesService.getCurrentQuestionnaire();
        this.questionnairesService.findAllQuestionsByQuestionnaire(this.questionnaire).subscribe(
            (response) => {
                this.questions = response as QuestionMgm[];
            }
        );
    }
}
