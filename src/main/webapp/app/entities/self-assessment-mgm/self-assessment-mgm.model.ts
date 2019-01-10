import {BaseEntity, User} from './../../shared';
import {CompanyProfileMgm} from '../company-profile-mgm';
import {CompanyGroupMgm} from '../company-group-mgm';
import {ThreatAgentMgm} from '../threat-agent-mgm';
import {ExternalAuditMgm} from '../external-audit-mgm';

export class SelfAssessmentMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public created?: any,
        public modified?: any,
        public user?: User,
        public companyProfile?: CompanyProfileMgm,
        public companyGroups?: CompanyGroupMgm[],
        public threatagents?: ThreatAgentMgm[],
        public externalAudit?: ExternalAuditMgm,
    ) {
    }
}
