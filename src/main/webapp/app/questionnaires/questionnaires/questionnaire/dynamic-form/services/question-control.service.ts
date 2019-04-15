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
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {QuestionMgm} from '../../../../../entities/question-mgm';
import {atLeastOneValidator} from '../validator/at-least-one-validator';

@Injectable()
export class QuestionControlService {

    constructor() {
    }

    toFormGroupCISOIdentifyThreatAgents(questions: QuestionMgm[]) {
        const group: any = {};

        questions.forEach((question) => {
            group[question.id] = new FormControl('');
        });

        const formGroup: FormGroup = new FormGroup(group);
        formGroup.validator = atLeastOneValidator();

        return formGroup;
    }

    toFormGroupCISOSelfAssessment(questions: QuestionMgm[]) {
        const group: any = {};

        questions.forEach((question) => {
            group[question.id] = new FormControl('');
            group[question.id + '.ciso.note'] = new FormControl('');
        });

        const formGroup: FormGroup = new FormGroup(group);
        formGroup.validator = atLeastOneValidator();

        return formGroup;
    }

    toFormGroupExternalAuditor(questions: QuestionMgm[]) {
        const group: any = {};

        questions.forEach((question) => {
            group[question.id] = new FormControl('');
            group[question.id + '.ciso.note'] = new FormControl('');
            group[question.id + '.external'] = new FormControl('');
            group[question.id + '.external.note'] = new FormControl('');
        });

        setTimeout(() => {
            console.log(group);
        }, 6000);

        const formGroup: FormGroup = new FormGroup(group);
        formGroup.validator = atLeastOneValidator();

        return formGroup;
    }
}
