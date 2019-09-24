import { BaseEntity } from './../../shared';

export const enum DataThreatLikelihood {
    'LOW',
    'MEDIUM',
    'HIGH'
}

export class OverallDataThreatMgm implements BaseEntity {
    constructor(
        public id?: number,
        public likelihood?: DataThreatLikelihood,
        public operation?: BaseEntity,
        public threats?: BaseEntity[],
    ) {
    }
}
