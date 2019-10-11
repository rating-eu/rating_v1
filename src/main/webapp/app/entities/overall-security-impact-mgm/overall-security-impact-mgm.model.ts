import { BaseEntity } from './../../shared';
import {DataImpact} from "../enumerations/gdpr/DataImpact.enum";
import {DataOperationMgm} from "../data-operation-mgm";
import {SecurityImpactMgm} from "../security-impact-mgm";

export class OverallSecurityImpactMgm implements BaseEntity {
    constructor(
        public id?: number,
        public impact?: DataImpact,
        public operation?: DataOperationMgm,
        public impacts?: SecurityImpactMgm[],
    ) {
    }
}
