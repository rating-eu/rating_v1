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
import {Principal} from '../../shared';
import {SelfAssessmentMgm} from '../../entities/self-assessment-mgm';
import {DatasharingService} from "../../datasharing/datasharing.service";
import {Router} from "@angular/router";
import {ImpactMode} from "../../entities/enumerations/ImpactMode.enum";

@Component({
    selector: 'jhi-dashboard-one',
    templateUrl: './dashboard-one.component.html',
    styleUrls: ['dashboard-one.component.css']
})
export class DashboardOneComponent implements OnInit {
    public selfAssessment: SelfAssessmentMgm = null;
    public impactModeEnum = ImpactMode;

    constructor(
        private principal: Principal,
        private datasharingService: DatasharingService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.selfAssessment = this.datasharingService.selfAssessment;

        if (!this.selfAssessment) {
            this.router.navigate(['/my-risk-assessments']);
        }
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }
}
