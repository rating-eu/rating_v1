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
            group[question.id + '.external'] = new FormControl('');
            group[question.id + '.note'] = new FormControl('');
        });

        setTimeout(() => {
            console.log(group);
        }, 6000);

        const formGroup: FormGroup = new FormGroup(group);
        formGroup.validator = atLeastOneValidator();

        return formGroup;
    }
}
