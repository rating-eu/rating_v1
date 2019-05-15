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

import {BaseEntity, User} from './../../shared';
import {CompanyProfileMgm} from '../company-profile-mgm';
import {CompanyGroupMgm} from '../company-group-mgm';
import {ExternalAuditMgm} from '../external-audit-mgm';
import {ImpactMode} from "../enumerations/ImpactMode.enum";

export class SelfAssessmentMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public created?: any,
        public modified?: any,
        public user?: User,
        public companyProfile?: CompanyProfileMgm,
        public companyGroups?: CompanyGroupMgm[],
        public externalAudit?: ExternalAuditMgm,
        public impactmode: ImpactMode = ImpactMode.QUANTITATIVE
    ) {
    }
}
