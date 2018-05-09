import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AnswerType, QuestionMgm} from '../../../../../entities/question-mgm';
import {QuestionnairesService} from '../../../../questionnaires.service';
import {AnswerMgm} from '../../../../../entities/answer-mgm';

@Component({
    selector: 'jhi-question',
    templateUrl: './question.component.html',
    styles: []
})
export class QuestionComponent implements OnInit {

    @Input() dynamicQuestion: QuestionMgm;
    @Input() form: FormGroup;
    // Store a reference to the enum
    answerType = AnswerType;
    answers: AnswerMgm[];

    get isValid() {
        return this.form.controls[this.dynamicQuestion.id].valid;
    }

    constructor(private questionnairesService: QuestionnairesService) {
    }

    ngOnInit() {
        this.questionnairesService.getAllAnswersByQuestion(this.dynamicQuestion).subscribe(
            (response) => {
                this.answers = response as AnswerMgm[];
                this.answers = this.answers.sort(function(a: AnswerMgm, b: AnswerMgm) {
                    return a.order - b.order;
                });
            }
        );
    }
}
