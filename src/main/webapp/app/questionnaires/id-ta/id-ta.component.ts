import {Component, OnInit} from '@angular/core';
import {Questionnaire} from '../models/Questionnaire';
import {QuestionnaireScope} from '../models/QuestionnaireScope';
import {QuestionnairesService} from '../questionnaires.service';

@Component({
    selector: 'jhi-id-ta',
    templateUrl: './id-ta.component.html',
    styles: [],
    providers: [QuestionnairesService]
})
export class IdTaComponent implements OnInit {

    private questionnaires: Questionnaire[];

    constructor(private questionnairesService: QuestionnairesService) {
    }

    ngOnInit() {
        this.getAllQuestionnairesByScope(QuestionnaireScope.ID_THREAT_AGENT);
    }

    getAllQuestionnairesByScope(scope: QuestionnaireScope) {
        this.questionnairesService.findAllByScope(scope).subscribe(
            (response) => {
                this.questionnaires = response;

                console.log('Data: ' + JSON.stringify(this.questionnaires));

                this.questionnaires.forEach(function(questionnaire) {
                    console.log('Questionnaire: ' + JSON.stringify(questionnaire));
                });
            },
            (error) => {
                console.log(error);
            }
        );
    }
}
