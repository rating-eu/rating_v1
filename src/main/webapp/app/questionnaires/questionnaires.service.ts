import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';
import {JhiDateUtils} from 'ng-jhipster';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {SERVER_API_URL} from '../app.constants';
import {QuestionnaireMgm, QuestionnairePurpose} from '../entities/questionnaire-mgm';

@Injectable()
export class QuestionnairesService {

    private resourceUrl = SERVER_API_URL + 'api/questionnaires/by/purpose/{purpose}';

    private currentQuestionnaire: QuestionnaireMgm;

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
    }

    findAllByPurpose(purpose: QuestionnairePurpose): Observable<QuestionnaireMgm[]> {
        return this.http.get<QuestionnaireMgm[]>(this.resourceUrl.replace('{purpose}', String(purpose)));
    }

    setCurrentQuestionnaire(questionnaire: QuestionnaireMgm) {
        this.currentQuestionnaire = questionnaire;
        console.log('Set Current Questionnaire: ' + JSON.stringify(this.currentQuestionnaire));
    }

    getCurrentQuestionnaire(): QuestionnaireMgm {
        console.log('Get Current Questionnaire: ' + JSON.stringify(this.currentQuestionnaire));
        return this.currentQuestionnaire;
    }
}
