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
import {QuestionnaireMgm} from '../questionnaire-mgm';
import {Status} from '../enumerations/QuestionnaireStatus.enum';
import {MyAnswerMgm} from '../my-answer-mgm';
import {CompanyProfileMgm} from "../company-profile-mgm";
export enum Role {
    'ROLE_ADMIN',
    'ROLE_USER',
    'ROLE_EXTERNAL_AUDIT',
    'ROLE_CISO'
}

export class QuestionnaireStatusMgm implements BaseEntity {
    constructor(
        public id?: number,
        public status?: Status,
        public created?: any,
        public modified?: any,
        public companyProfile?: CompanyProfileMgm,
        public questionnaire?: QuestionnaireMgm,
        public role?: Role,
        public user?: User,
        public answers?: MyAnswerMgm[],
    ) {
    }
}
