import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {QuestionMgm} from '../../../../../entities/question-mgm';

@Injectable()
export class QuestionControlService {

    constructor() {
    }

    toFormGroup(questions: QuestionMgm[]) {
        const group: any = {};

        questions.forEach((question) => {
            group[question.id] = new FormControl('', Validators.required);
        });
        return new FormGroup(group);
    }
}
