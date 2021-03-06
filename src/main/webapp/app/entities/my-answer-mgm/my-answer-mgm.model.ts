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

import { BaseEntity, User } from './../../shared';
import {AnswerMgm} from '../answer-mgm';
import {QuestionMgm} from '../question-mgm';
import {QuestionnaireMgm} from '../questionnaire-mgm';
import {QuestionnaireStatusMgm} from '../questionnaire-status-mgm';

export class MyAnswerMgm implements BaseEntity {
    constructor(
        public id?: number,
        public note?: string,
        public answerOffset = 0,
        public answer?: AnswerMgm,
        public question?: QuestionMgm,
        public questionnaire?: QuestionnaireMgm,
        public questionnaireStatus?: QuestionnaireStatusMgm,
        public user?: User,
    ) {
    }
}
