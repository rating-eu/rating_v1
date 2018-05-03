import { BaseEntity } from './../../shared';

export const enum Likelihood {
    'LOW',
    'LOW_MEDIUM',
    'MEDIUM',
    'MEDIUM_HIGH',
    'HIGH'
}

export class LikelihoodPositionMgm implements BaseEntity {
    constructor(
        public id?: number,
        public likelihood?: Likelihood,
        public position?: number,
    ) {
    }
}
