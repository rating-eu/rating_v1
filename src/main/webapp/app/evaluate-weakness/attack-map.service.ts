import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SERVER_API_URL} from '../app.constants';
import {AugmentedAttackStrategy} from './models/augmented-attack-strategy.model';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AttackMapService {
    private resourceUrl = SERVER_API_URL + 'api/{selfAssessmentID}/attack-matrix';


    constructor(private http: HttpClient) {
    }

    getAttackCKC7Matrix(selfAssessmentID: number): Observable<Map<Number/*Level.ID*/, Map<Number/*Phase.ID*/, AugmentedAttackStrategy>>> {
        return this.http.get<Map<Number, Map<Number, AugmentedAttackStrategy>>>(this.resourceUrl.replace('{selfAssessmentID}', selfAssessmentID + ''));
    }
}
