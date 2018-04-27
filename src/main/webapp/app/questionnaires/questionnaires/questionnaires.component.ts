import {Component, OnInit} from '@angular/core';
import {QuestionnairesService} from '../questionnaires.service';
import {QuestionnairePurpose} from '../../entities/questionnaire-mgm';
import {QuestionnaireMgm} from '../../entities/questionnaire-mgm';

@Component({
    selector: 'jhi-questionnaires',
    templateUrl: './questionnaires.component.html',
    styles: [],
})
export class QuestionnairesComponent implements OnInit {

    private questionnaires: QuestionnaireMgm[];

    constructor(private questionnairesService: QuestionnairesService) {
    }

    ngOnInit() {
        this.getAllQuestionnairesByPurpose(QuestionnairePurpose.ID_THREAT_AGENT);
    }

    getAllQuestionnairesByPurpose(purpose: QuestionnairePurpose) {
        this.questionnairesService.findAllByPurpose(purpose).subscribe(
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

    setCurrentQuestionnaire(questionnaire: QuestionnaireMgm) {
        this.questionnairesService.setCurrentQuestionnaire(questionnaire);
    }
}
