import {Component, Input, OnInit} from '@angular/core';
import {QuestionControlService} from './services/question-control.service';
import {FormGroup} from '@angular/forms';
import {QuestionMgm} from '../../../../entities/question-mgm';

@Component({
    selector: 'jhi-dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styles: [],
    providers: [QuestionControlService]
})
export class DynamicFormComponent implements OnInit {
    @Input() messageFromParent: String = 'PercheNonFunziona';
    _questionsArray: QuestionMgm[];
    form: FormGroup;
    payLoad = '';

    constructor(private questionControlService: QuestionControlService) {

    }

    @Input()
    set questionsArray(questionsArray: QuestionMgm[]) {
        console.log('QuestionsArray changed...');
        this._questionsArray = questionsArray;
        console.log('Now its ' + this._questionsArray);

        // Now we can create the form, since the questionsArray is no more undefined
        if (this._questionsArray) {
            this.form = this.questionControlService.toFormGroup(this._questionsArray);
        }
    }

    get questionsArray() {
        return this._questionsArray;
    }

    ngOnInit() {
    }

    onSubmit() {
        this.payLoad = JSON.stringify(this.form.value);
    }
}
