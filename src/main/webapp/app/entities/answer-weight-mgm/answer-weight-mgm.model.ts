import { BaseEntity } from './../../shared';

export const enum Likelihood {
    'LOW',
    'LOW_MEDIUM',
    'MEDIUM',
    'MEDIUM_HIGH',
    'HIGH'
}

export const enum QuestionType {
    'REGULAR',
    'RELEVANT',
    'OTHER'
}

export class AnswerWeightMgm implements BaseEntity {
    constructor(
        public id?: number,
        public likelihood?: Likelihood,
        public questionType?: QuestionType,
        public weight?: number,
    ) {
    }
}
