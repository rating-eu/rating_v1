import {Component, OnInit} from '@angular/core';
import {QuestionnairePurpose} from '../models/QuestionnairePurpose';
import {QuestionnairesService} from '../questionnaires.service';
import {Questionnaire} from '../models/Questionnaire';

@Component({
    selector: 'jhi-questionnaires',
    templateUrl: './questionnaires.component.html',
    styles: [],
})
export class QuestionnairesComponent implements OnInit {

    private questionnaires: Questionnaire[];

    constructor(private questionnairesService: QuestionnairesService) {
    }

    ngOnInit() {
        this.getAllQuestionnairesByScope(QuestionnairePurpose.ID_THREAT_AGENT);
    }

    getAllQuestionnairesByScope(scope: QuestionnairePurpose) {
        this.questionnairesService.findAllByPurpose(scope).subscribe(
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

    setCurrentQuestionnaire(questionnaire: Questionnaire) {
        this.questionnairesService.setCurrentQuestionnaire(questionnaire);
    }
}
