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
    'CUSTOM',
    'ASSET'
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
        public attackStrategies?: BaseEntity[],
        public answers?: BaseEntity[],
        public questionnaire?: BaseEntity,
        public threatAgent?: BaseEntity,
    ) {
    }
}
