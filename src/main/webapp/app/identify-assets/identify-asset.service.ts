import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { AttackStrategyMgm } from '../entities/attack-strategy-mgm/attack-strategy-mgm.model';
import { createRequestOption } from '../shared';

export type EntityResponseType = HttpResponse<AttackStrategyMgm>;

@Injectable()
export class EvaluateService {

}
