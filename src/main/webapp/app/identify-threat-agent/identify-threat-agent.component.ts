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

import {Component, OnInit} from '@angular/core';
import {SelfAssessmentMgm} from '../entities/self-assessment-mgm';
import {DatasharingService} from "../datasharing/datasharing.service";

@Component({
    selector: 'jhi-identify-threat-agent',
    templateUrl: './identify-threat-agent.component.html',
    styleUrls: [
      'identify-threat-agent.css'
    ]
})
export class IdentifyThreatAgentComponent implements OnInit {
    mySelf: SelfAssessmentMgm = null;

    constructor(
        private dataSharingService: DatasharingService
    ) {
    }

    ngOnInit() {
        this.mySelf = this.dataSharingService.selfAssessment;

    }

    previousState() {
        window.history.back();
    }
}
