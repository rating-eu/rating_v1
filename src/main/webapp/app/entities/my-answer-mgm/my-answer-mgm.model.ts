import { BaseEntity, User } from './../../shared';
import {AnswerMgm} from '../answer-mgm';
import {QuestionMgm} from '../question-mgm';
import {QuestionnaireMgm} from '../questionnaire-mgm';

export class MyAnswerMgm implements BaseEntity {
    constructor(
        public id?: number,
        public note?: string,
        public answerOffset: number = 0,
        public answer?: AnswerMgm,
        public question?: QuestionMgm,
        public questionnaire?: QuestionnaireMgm,
        public questionnaireStatus?: BaseEntity,
        public user?: User,
    ) {
    }
}
