import { BaseEntity } from './../../shared';

export const enum Likelihood {
    'LOW',
    'MEDIUM',
    'HIGH',
    'MEDIUM_HIGH',
    'LOW_MEDIUM'
}

export class AnswerMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public created?: any,
        public modified?: any,
        public order?: number,
        public likelihood?: Likelihood,
        public threatAgents?: BaseEntity[],
        public attacks?: BaseEntity[],
        public myanswer?: BaseEntity,
        public question?: BaseEntity,
    ) {
    }
}
