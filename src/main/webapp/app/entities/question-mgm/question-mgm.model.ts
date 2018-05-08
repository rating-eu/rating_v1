import { BaseEntity } from './../../shared';

export const enum QuestionType {
    'REGULAR',
    'RELEVANT',
    'OTHER'
}

export const enum AnswerType {
    'YESNO',
    'RANGE5',
    'PERC5',
    'RANGE3',
    'PERC3',
    'CUSTOM'
}

export class QuestionMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public created?: any,
        public modified?: any,
        public order?: number,
        public questionType?: QuestionType,
        public answerType?: AnswerType,
        public threatAgent?: BaseEntity,
        public answers?: BaseEntity[],
        public myanswer?: BaseEntity,
        public questionnaire?: BaseEntity,
    ) {
    }
}
