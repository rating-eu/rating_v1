import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { HermeneutCompanyProfileMgmModule } from './company-profile-mgm/company-profile-mgm.module';
import { HermeneutCompanySectorMgmModule } from './company-sector-mgm/company-sector-mgm.module';
import { HermeneutDomainOfInfluenceMgmModule } from './domain-of-influence-mgm/domain-of-influence-mgm.module';
import { HermeneutSelfAssessmentMgmModule } from './self-assessment-mgm/self-assessment-mgm.module';
import { HermeneutContainerMgmModule } from './container-mgm/container-mgm.module';
import { HermeneutAssetCategoryMgmModule } from './asset-category-mgm/asset-category-mgm.module';
import { HermeneutAssetMgmModule } from './asset-mgm/asset-mgm.module';
import { HermeneutThreatAgentMgmModule } from './threat-agent-mgm/threat-agent-mgm.module';
import { HermeneutMotivationMgmModule } from './motivation-mgm/motivation-mgm.module';
import { HermeneutAttackStrategyMgmModule } from './attack-strategy-mgm/attack-strategy-mgm.module';
import { HermeneutMitigationMgmModule } from './mitigation-mgm/mitigation-mgm.module';
import { HermeneutQuestionnaireMgmModule } from './questionnaire-mgm/questionnaire-mgm.module';
import { HermeneutQuestionMgmModule } from './question-mgm/question-mgm.module';
import { HermeneutAnswerMgmModule } from './answer-mgm/answer-mgm.module';
import { HermeneutExternalAuditMgmModule } from './external-audit-mgm/external-audit-mgm.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        HermeneutCompanyProfileMgmModule,
        HermeneutCompanySectorMgmModule,
        HermeneutDomainOfInfluenceMgmModule,
        HermeneutSelfAssessmentMgmModule,
        HermeneutContainerMgmModule,
        HermeneutAssetCategoryMgmModule,
        HermeneutAssetMgmModule,
        HermeneutThreatAgentMgmModule,
        HermeneutMotivationMgmModule,
        HermeneutAttackStrategyMgmModule,
        HermeneutMitigationMgmModule,
        HermeneutQuestionnaireMgmModule,
        HermeneutQuestionMgmModule,
        HermeneutAnswerMgmModule,
        HermeneutExternalAuditMgmModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutEntityModule {}
