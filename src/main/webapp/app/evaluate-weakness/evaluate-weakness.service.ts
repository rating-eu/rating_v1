import {Injectable} from '@angular/core';
import {AttackStrategyMgm} from '../entities/attack-strategy-mgm/attack-strategy-mgm.model';
import {QuestionnaireStatusMgm} from '../entities/questionnaire-status-mgm';
import {Router} from '@angular/router';
import {HttpResponse} from '@angular/common/http';

export type EntityResponseType = HttpResponse<AttackStrategyMgm>;

@Injectable()
export class EvaluateService {

    constructor(private router: Router) {
    }

    showEvaluatedAttackStrategies(questionnaireStatus: QuestionnaireStatusMgm) {
        console.log('AttackStrategies QuestionnaireStatus: ' + JSON.stringify(questionnaireStatus));
        this.router.navigate(['/evaluate-weakness/result']);
    }
}
