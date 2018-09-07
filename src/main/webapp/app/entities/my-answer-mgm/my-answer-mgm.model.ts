import { BaseEntity, User } from './../../shared';
import {AnswerMgm} from '../answer-mgm';
import {QuestionMgm} from '../question-mgm';
import {QuestionnaireMgm} from '../questionnaire-mgm';
import {QuestionnaireStatusMgm} from '../questionnaire-status-mgm';

export class MyAnswerMgm implements BaseEntity {
    constructor(
        public id?: number,
        public note?: string,
        public answerOffset = 0,
        public answer?: AnswerMgm,
        public question?: QuestionMgm,
        public questionnaire?: QuestionnaireMgm,
        public questionnaireStatus?: QuestionnaireStatusMgm,
        public user?: User,
    ) {
    }
}
