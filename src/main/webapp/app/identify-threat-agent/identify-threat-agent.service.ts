import {Injectable} from '@angular/core';
import {SERVER_API_URL} from '../app.constants';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {MotivationMgm} from '../entities/motivation-mgm';
import {QuestionnaireMgm} from '../entities/questionnaire-mgm';

@Injectable()
export class IdentifyThreatAgentService {

    motivationsAPI = SERVER_API_URL + 'api/motivations';

    constructor(private http: HttpClient) {
    }

    findAllMotivations(): Observable<MotivationMgm[]> {
        return this.http.get<MotivationMgm[]>(this.motivationsAPI);
    }
}
