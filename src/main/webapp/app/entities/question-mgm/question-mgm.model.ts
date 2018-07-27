import { BaseEntity } from './../../shared';
import {AttackStrategyMgm} from '../attack-strategy-mgm';
import {AnswerMgm} from '../answer-mgm';
import {MyAnswerMgm} from '../my-answer-mgm';
import {QuestionType} from '../enumerations/QuestionType.enum';
import {AnswerType} from '../enumerations/AnswerType.enum';
import {QuestionnaireMgm} from '../questionnaire-mgm';
import {ThreatAgentMgm} from '../threat-agent-mgm';

export class QuestionMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public created?: any,
        public modified?: any,
        public order?: number,
        public questionType?: QuestionType,
        public answerType?: AnswerType,
        public attackStrategies?: AttackStrategyMgm[],
        public answers?: AnswerMgm[],
        public myanswer?: MyAnswerMgm,
        public questionnaire?: QuestionnaireMgm,
        public threatAgent?: ThreatAgentMgm,
    ) {
    }
}
