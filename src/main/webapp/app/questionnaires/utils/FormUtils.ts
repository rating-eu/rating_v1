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

import {FormGroup} from '@angular/forms';
import {QuestionMgm} from '../../entities/question-mgm';

export class FormUtils {
    static formToMap<V>(formGroup: FormGroup): Map<string, V> {
        const m: Map<string, V> = new Map<string, V>();
        const formData = formGroup.value;

        Object.keys(formData).forEach((key: string) => {
            // Ignore missing answers
            if (formData[key]) {
                m.set(key, formData[key] as V);
            }
        });

        return m;
    }

    static questionsToMap(questions: QuestionMgm[]): Map<number, QuestionMgm> {
        const questionsMap: Map<number, QuestionMgm> = new Map();

        questions.forEach((value: QuestionMgm) => {
            questionsMap.set(value.id, value);
        });

        return questionsMap;
    }
}
