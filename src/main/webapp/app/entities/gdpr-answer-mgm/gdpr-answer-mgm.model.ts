import { BaseEntity } from './../../shared';

export const enum Language {
    'IT',
    'EN',
    'DE',
    'ES',
    'FR',
    'PT_PT'
}

export const enum AnswerValue {
    'YES',
    'NO'
}

export const enum DataImpact {
    'LOW',
    'MEDIUM',
    'HIGH',
    'VERY_HIGH'
}

export class GDPRAnswerMgm implements BaseEntity {
    constructor(
        public id?: number,
        public text?: string,
        public language?: Language,
        public answerValue?: AnswerValue,
        public dataImpact?: DataImpact,
        public order?: number,
        public translations?: BaseEntity[],
        public questions?: BaseEntity[],
    ) {
    }
}
