import {BaseEntity} from './../../shared';
import {ThreatAgentMgm} from '../threat-agent-mgm';
import {AnswerMgm} from '../answer-mgm';
import {AttackStrategyMgm} from '../attack-strategy-mgm';
import {MyAnswerMgm} from '../my-answer-mgm';
import {QuestionnaireMgm} from '../questionnaire-mgm';
import {QuestionType} from '../enumerations/QuestionType.enum';
import {AnswerType} from '../enumerations/AnswerType.enum';

export class QuestionMgm implements BaseEntity {
    constructor(public id?: number,
                public name?: string,
                public created?: any,
                public modified?: any,
                public order?: number,
                public questionType?: QuestionType,
                public answerType?: AnswerType,
                public threatAgent?: ThreatAgentMgm,
                public answers?: AnswerMgm[],
                public attackStrategies?: AttackStrategyMgm[],
                public myanswer?: MyAnswerMgm,
                public questionnaire?: QuestionnaireMgm) {
    }
}
