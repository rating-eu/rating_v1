import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {QuestionMgm} from '../../../../../entities/question-mgm';
import {atLeastOneValidator} from '../validator/at-least-one-validator';

@Injectable()
export class QuestionControlService {

    constructor() {
    }

    toFormGroupCISO(questions: QuestionMgm[]) {
        const group: any = {};

        questions.forEach((question) => {
            group[question.id] = new FormControl('');
        });

        setTimeout(() => {
            console.log(group);
        }, 5000);

        const formGroup: FormGroup = new FormGroup(group);
        formGroup.validator = atLeastOneValidator();
        console.log('Validator:');
        console.log(formGroup.validator);

        return formGroup;
    }

    toFormGroupExternalAuditor(questions: QuestionMgm[]) {
        const group: any = {};

        questions.forEach((question) => {
            group[question.id] = new FormControl('');
            group[question.id + '.external'] = new FormControl('');
            group[question.id + '.note'] = new FormControl('');
        });

        setTimeout(() => {
            console.log(group);
        }, 6000);

        const formGroup: FormGroup = new FormGroup(group);
        formGroup.validator = atLeastOneValidator();
        console.log('Validator:');
        console.log(formGroup.validator);

        return formGroup;
    }
}
