import {BaseEntity} from './../../shared';
import {DataRiskLevel} from '../enumerations/gdpr/DataRiskLevel.enum';
import {DataOperationMgm} from '../data-operation-mgm';

export class OverallDataRiskMgm implements BaseEntity {
    constructor(
        public id?: number,
        public riskLevel?: DataRiskLevel,
        public operation?: DataOperationMgm
    ) {
    }
}
