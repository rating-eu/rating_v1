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
    @Input() questions: QuestionMgm[];
    form: FormGroup;
    payLoad = '';

    constructor(private qcs: QuestionControlService) {

    }

    ngOnInit() {
        console.log('MessageFromParent: ' + this.messageFromParent);
        console.log('Questions: ' + JSON.stringify(this.questions));
        // this.form = this.qcs.toFormGroup(this.questions);
    }

    onSubmit() {
        this.payLoad = JSON.stringify(this.form.value);
    }
}
