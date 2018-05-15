import { BaseEntity, User } from './../../shared';
import {AnswerMgm} from '../answer-mgm';
import {QuestionMgm} from '../question-mgm';
import {QuestionnaireMgm} from '../questionnaire-mgm';

export class MyAnswerMgm implements BaseEntity {
    constructor(
        public id?: number,
        public mycheck?: string,
        public answer?: AnswerMgm,
        public question?: QuestionMgm,
        public questionnaire?: QuestionnaireMgm,
        public user?: User,
    ) {
    }
}
