/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {QuestionnaireStatusMgm} from '../entities/questionnaire-status-mgm';
import {Router} from '@angular/router';

@Injectable()
export class IdentifyThreatAgentService {

    constructor(private http: HttpClient, private router: Router) {
    }

    showThreatAgentsResult(questionnaireStatus: QuestionnaireStatusMgm) {
        this.router.navigate(['/identify-threat-agent/result', questionnaireStatus.id]);
    }
}
