import {BaseEntity} from './../../shared';
import {SecurityPillar} from '../enumerations/gdpr/SecurityPillar.enum';
import {DataImpact} from '../enumerations/gdpr/DataImpact.enum';
import {DataOperationMgm} from '../data-operation-mgm';
import {OverallSecurityImpactMgm} from '../overall-security-impact-mgm';

export class SecurityImpactMgm implements BaseEntity {
    constructor(
        public id?: number,
        public securityPillar?: SecurityPillar,
        public impact?: DataImpact,
        public operation?: DataOperationMgm,
        public overallSecurityImpact?: OverallSecurityImpactMgm,
    ) {
    }
}
