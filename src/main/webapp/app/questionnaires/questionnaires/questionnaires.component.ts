import {Component, OnInit} from '@angular/core';
import {QuestionnairesService} from '../questionnaires.service';
import {QuestionnairePurpose} from '../../entities/questionnaire-mgm';
import {QuestionnaireMgm} from '../../entities/questionnaire-mgm';
import {Observable} from 'rxjs/Observable';
import {DatasharingService} from '../../datasharing/datasharing.service';

@Component({
    selector: 'jhi-questionnaires',
    templateUrl: './questionnaires.component.html',
    styles: [],
})
export class QuestionnairesComponent implements OnInit {

    private purpose: QuestionnairePurpose = QuestionnairePurpose.ID_THREAT_AGENT;
    private questionnaires$: Observable<QuestionnaireMgm[]>;

    constructor(private questionnairesService: QuestionnairesService, private dataSharingService: DatasharingService) {
    }

    ngOnInit() {
        this.questionnaires$ = this.questionnairesService.getAllQuestionnairesByPurpose(this.purpose);
    }

    setCurrentQuestionnaire(questionnaire: QuestionnaireMgm) {
        this.dataSharingService.currentQuestionnaire = questionnaire;
    }
}
