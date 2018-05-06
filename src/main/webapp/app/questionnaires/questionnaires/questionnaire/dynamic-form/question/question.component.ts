import {Component, Input, OnInit} from '@angular/core';
import {QuestionBase} from '../models/question-base';
import {FormGroup} from '@angular/forms';

@Component({
    selector: 'jhi-question',
    templateUrl: './question.component.html',
    styles: []
})
export class QuestionComponent implements OnInit {

    @Input() question: QuestionBase<any>;
    @Input() form: FormGroup;

    get isValid() {
        return this.form.controls[this.question.key].valid;
    }

    constructor() {
    }

    ngOnInit() {
    }

}
