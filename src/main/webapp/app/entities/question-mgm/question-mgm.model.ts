import {BaseEntity} from './../../shared';
import {AnswerMgm} from '../answer-mgm';

export const enum QuestionType {
    'REGULAR',
    'RELEVANT',
    'OTHER'
}

export enum AnswerType {
    'YESNO', // RADIO or SELECT
    'RANGE5', // RADIO or SELECT
    'PERC5', // RADIO or SELECT
    'RANGE3', // RADIO or SELECT
    'PERC3', // RADIO or SELECT
    'CUSTOM'
}

export class QuestionMgm implements BaseEntity {
    constructor(public id?: number,
                public name?: string,
                public created?: any,
                public modified?: any,
                public order?: number,
                public questionType?: QuestionType,
                public answerType?: AnswerType,
                public answers?: AnswerMgm[],
                public myanswer?: AnswerMgm,
                public questionnaire?: BaseEntity) {
    }
}
