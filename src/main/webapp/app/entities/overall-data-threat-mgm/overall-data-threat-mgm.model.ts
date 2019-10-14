import {BaseEntity} from './../../shared';
import {DataThreatLikelihood} from '../enumerations/gdpr/DataThreatLikelihood.enum';
import {DataOperationMgm} from '../data-operation-mgm';
import {DataThreatMgm} from '../data-threat-mgm';

export class OverallDataThreatMgm implements BaseEntity {
    constructor(
        public id?: number,
        public likelihood?: DataThreatLikelihood,
        public operation?: DataOperationMgm,
        public threats?: DataThreatMgm[],
    ) {
    }
}
