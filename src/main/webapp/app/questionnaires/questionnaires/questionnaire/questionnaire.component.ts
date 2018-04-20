import {Component, Input, OnInit} from '@angular/core';
import {Questionnaire} from '../../models/Questionnaire';
import {QuestionnairesService} from '../../questionnaires.service';
import {Question} from '../../models/Question';

@Component({
    selector: 'jhi-questionnaire',
    templateUrl: './questionnaire.component.html',
    styles: [],
})
export class QuestionnaireComponent implements OnInit {

    private questionnaire: Questionnaire;

    constructor(private questionnairesService: QuestionnairesService) {
    }

    ngOnInit() {
        this.questionnaire = this.questionnairesService.getCurrentQuestionnaire();
    }
}
