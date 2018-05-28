import {BaseEntity, User} from './../../shared';
import {ThreatAgentMgm} from '../threat-agent-mgm';
import {AssetMgm} from '../asset-mgm';
import {CompanyProfileMgm} from '../company-profile-mgm';
import {DepartmentMgm} from '../department-mgm';
import {AttackStrategyMgm} from '../attack-strategy-mgm';
import {ExternalAuditMgm} from '../external-audit-mgm';
import {QuestionnaireMgm} from '../questionnaire-mgm';

export class SelfAssessmentMgm implements BaseEntity {
    constructor(public id?: number,
                public name?: string,
                public created?: any,
                public modified?: any,
                public user?: User,
                public companyprofiles?: CompanyProfileMgm[],
                public departments?: DepartmentMgm[],
                public assets?: AssetMgm[],
                public threatagents?: ThreatAgentMgm[],
                public attackstrategies?: AttackStrategyMgm[],
                public externalaudits?: ExternalAuditMgm[],
                public questionnaires?: QuestionnaireMgm[]) {
    }
}
