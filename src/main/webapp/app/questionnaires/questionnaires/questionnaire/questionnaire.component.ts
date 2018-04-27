import {Component, Input, OnInit} from '@angular/core';
import {QuestionnairesService} from '../../questionnaires.service';
import {QuestionnaireMgm} from '../../../entities/questionnaire-mgm';

@Component({
    selector: 'jhi-questionnaire',
    templateUrl: './questionnaire.component.html',
    styles: [],
})
export class QuestionnaireComponent implements OnInit {

    private questionnaire: QuestionnaireMgm;

    constructor(private questionnairesService: QuestionnairesService) {
    }

    ngOnInit() {
        this.questionnaire = this.questionnairesService.getCurrentQuestionnaire();
    }
}
