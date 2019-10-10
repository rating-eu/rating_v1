import {BaseEntity} from './../../shared';
import {ThreatArea} from '../enumerations/gdpr/ThreatArea.enum';
import {DataThreatLikelihood} from '../enumerations/gdpr/DataThreatLikelihood.enum';
import {OverallDataThreatMgm} from '../overall-data-threat-mgm';

export class DataThreatMgm implements BaseEntity {
    constructor(
        public id?: number,
        public threatArea?: ThreatArea,
        public likelihood?: DataThreatLikelihood,
        public operation?: BaseEntity,
        public overallDataThreat?: OverallDataThreatMgm,
    ) {
    }
}
