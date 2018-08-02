import {FormGroup} from '@angular/forms';
import {QuestionMgm} from '../../entities/question-mgm';

export class FormUtils {
    static formToMap<V>(formGroup: FormGroup): Map<string, V> {
        const m: Map<string, V> = new Map<string, V>();
        const formData = formGroup.value;

        Object.keys(formData).forEach((key: string) => {
            m.set(key, formData[key] as V);
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
