import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';
import {Questionnaire} from './models/Questionnaire';
import {QuestionnaireScope} from './models/QuestionnaireScope';
import {JhiDateUtils} from 'ng-jhipster';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {SERVER_API_URL} from '../app.constants';

@Injectable()
export class QuestionnairesService {

    private resourceUrl = SERVER_API_URL + 'api/questionnaires/by/scope/ID_THREAT_AGENT';

    private currentQuestionnaire: Questionnaire;

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
    }

    findAllByScope(scope: QuestionnaireScope): Observable<Questionnaire[]> {
        // return this.http.get(this.apiUrl)
        //     .map((res: Response) => res.json())
        //     .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

        return this.http.get<Questionnaire[]>(this.resourceUrl);
    }

    setCurrentQuestionnaire(questionnaire: Questionnaire) {
        this.currentQuestionnaire = questionnaire;
        console.log('Set Current Questionnaire: ' + JSON.stringify(this.currentQuestionnaire));
    }

    getCurrentQuestionnaire(): Questionnaire {
        console.log('Get Current Questionnaire: ' + JSON.stringify(this.currentQuestionnaire));
        return this.currentQuestionnaire;
    }
}
