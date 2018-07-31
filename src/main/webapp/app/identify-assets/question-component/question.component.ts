// tslint:disable:component-selector
import * as _ from 'lodash';

import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { QuestionMgm } from '../../entities/question-mgm';
import { SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import { QuestionnaireMgm } from '../../entities/questionnaire-mgm';
import { MyAnswerMgm } from '../../entities/my-answer-mgm';
import { User, AccountService, UserService } from '../../shared';
import { AnswerMgm } from '../../entities/answer-mgm';

@Component({
    selector: 'question-card',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.css'],
    providers: []
})

export class QuestionComponent implements OnInit {
    @Input() public question: QuestionMgm;
    @Input() public questionRenderType: string;
    @Input() public self: SelfAssessmentMgm;
    @Input() public questionnaire: QuestionnaireMgm;
    @Input() public user: User;
    @Output() public myAnswerComplited = new EventEmitter();
    public renderType: string;
    private myAnswer: MyAnswerMgm;

    constructor(
        private accountService: AccountService,
        private userService: UserService) { }

    ngOnInit() {
        if (this.questionRenderType.search('rank') !== -1) {
            this.renderType = 'select_rank';
        } else if (this.questionRenderType.search('directly stolen/compromised/damaged')  !== -1) {
            this.renderType = 'select_direct_assets';
        }
        console.log(this.question);
        // console.log(this.self);
        // console.log(this.questionnaire);
        // console.log(this.question.answers);
        // console.log(_.sortBy(this.question.answers, 'order'));
        // this.question.answers = _.sortBy(this.question.answers, 'order');
        // console.log(this.question.answers);
        this.myAnswer = new MyAnswerMgm();
        this.myAnswer.answer = this.question.answers[0];
        this.myAnswer.question = this.question;
        this.myAnswer.questionnaire = this.questionnaire;
        this.accountService.get().subscribe((response1) => {
            const account = response1.body;
            this.userService.find(account['login']).subscribe((response2) => {
                this.user = response2.body;
                this.myAnswer.user = this.user;
                this.myAnswerComplited.emit(this.myAnswer);
            });
        });

    }

    public onAnswerResponded(myAnswer: MyAnswerMgm) {
        if (myAnswer) {
            this.myAnswerComplited.emit(myAnswer);
        }
    }

    public select(ans: AnswerMgm) {
        console.log(ans);
    }

}
