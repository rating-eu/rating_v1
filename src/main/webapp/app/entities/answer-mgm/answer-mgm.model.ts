import { BaseEntity } from './../../shared';

export const enum Likelihood {
    'LOW',
    'LOW_MEDIUM',
    'MEDIUM',
    'MEDIUM_HIGH',
    'HIGH'
}

export class AnswerMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public created?: any,
        public modified?: any,
        public order?: number,
        public likelihood?: Likelihood,
        public attacks?: BaseEntity[],
        public myanswer?: BaseEntity,
        public question?: BaseEntity,
    ) {
    }
}
