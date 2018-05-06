import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AnswerType, QuestionMgm} from '../../../../../entities/question-mgm';

@Component({
    selector: 'jhi-question',
    templateUrl: './question.component.html',
    styles: []
})
export class QuestionComponent implements OnInit {

    @Input() question: QuestionMgm;
    @Input() form: FormGroup;
    // Store a reference to the enum
    answerType = AnswerType;

    get isValid() {
        return this.form.controls[this.question.key].valid;
    }

    constructor() {
    }

    ngOnInit() {
    }

}
