import { BaseEntity } from './../../shared';

export const enum ThreatArea {
    'NETWORK_AND_TECHNICAL_RESOURCES',
    'PROCEDURES_RELATED_TO_THE_PROCESSING_OF_PERSONAL_DATA',
    'PEOPLE_INVOLVED_IN_THE_PROCESSING_OF_PERFONAL_DATA',
    'BUSINESS_SECTOR_AND_SCALE_OF_PROCESSING'
}

export const enum DataThreatLikelihood {
    'LOW',
    'MEDIUM',
    'HIGH'
}

export class DataThreatMgm implements BaseEntity {
    constructor(
        public id?: number,
        public threatArea?: ThreatArea,
        public likelihood?: DataThreatLikelihood,
        public operation?: BaseEntity,
        public overallDataThreat?: BaseEntity,
    ) {
    }
}
