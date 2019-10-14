/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {HermeneutCompanyProfileMgmModule} from './company-profile-mgm/company-profile-mgm.module';
import {HermeneutDomainOfInfluenceMgmModule} from './domain-of-influence-mgm/domain-of-influence-mgm.module';
import {HermeneutSelfAssessmentMgmModule} from './self-assessment-mgm/self-assessment-mgm.module';
import {HermeneutContainerMgmModule} from './container-mgm/container-mgm.module';
import {HermeneutAssetCategoryMgmModule} from './asset-category-mgm/asset-category-mgm.module';
import {HermeneutMotivationMgmModule} from './motivation-mgm/motivation-mgm.module';
import {HermeneutThreatAgentMgmModule} from './threat-agent-mgm/threat-agent-mgm.module';
import {HermeneutAssetMgmModule} from './asset-mgm/asset-mgm.module';
import {HermeneutAttackStrategyMgmModule} from './attack-strategy-mgm/attack-strategy-mgm.module';
import {HermeneutMitigationMgmModule} from './mitigation-mgm/mitigation-mgm.module';
import {HermeneutQuestionnaireMgmModule} from './questionnaire-mgm/questionnaire-mgm.module';
import {HermeneutQuestionMgmModule} from './question-mgm/question-mgm.module';
import {HermeneutAnswerMgmModule} from './answer-mgm/answer-mgm.module';
import {HermeneutExternalAuditMgmModule} from './external-audit-mgm/external-audit-mgm.module';
import {HermeneutMyAnswerMgmModule} from './my-answer-mgm/my-answer-mgm.module';
import {HermeneutAnswerWeightMgmModule} from './answer-weight-mgm/answer-weight-mgm.module';
import {HermeneutQuestionnaireStatusMgmModule} from './questionnaire-status-mgm/questionnaire-status-mgm.module';
import {HermeneutLevelMgmModule} from './level-mgm/level-mgm.module';
import {HermeneutPhaseMgmModule} from './phase-mgm/phase-mgm.module';
import {HermeneutCompanyGroupMgmModule} from './company-group-mgm/company-group-mgm.module';
import {HermeneutMyAssetMgmModule} from './my-asset-mgm/my-asset-mgm.module';
import {HermeneutDirectAssetMgmModule} from './direct-asset-mgm/direct-asset-mgm.module';
import {HermeneutIndirectAssetMgmModule} from './indirect-asset-mgm/indirect-asset-mgm.module';
import {HermeneutAttackCostMgmModule} from './attack-cost-mgm/attack-cost-mgm.module';
import {HermeneutEconomicCoefficientsMgmModule} from './economic-coefficients-mgm/economic-coefficients-mgm.module';
import {HermeneutEBITMgmModule} from './ebit-mgm/ebit-mgm.module';
import {HermeneutEconomicResultsMgmModule} from './economic-results-mgm/economic-results-mgm.module';
import {HermeneutSplittingLossMgmModule} from './splitting-loss-mgm/splitting-loss-mgm.module';
import {HermeneutCriticalLevelMgmModule} from './critical-level-mgm/critical-level-mgm.module';
import {HermeneutLikelihoodScaleMgmModule} from './likelihood-scale-mgm/likelihood-scale-mgm.module';
import {HermeneutVulnerabilityScaleMgmModule} from './vulnerability-scale-mgm/vulnerability-scale-mgm.module';
import {HermeneutMyCompanyMgmModule} from './my-company-mgm/my-company-mgm.module';
import {HermeneutImpactLevelMgmModule} from './impact-level-mgm/impact-level-mgm.module';
import {HermeneutImpactLevelDescriptionMgmModule} from './impact-level-description-mgm/impact-level-description-mgm.module';
import {HermeneutSplittingValueMgmModule} from './splitting-value-mgm/splitting-value-mgm.module';
import {HermeneutLogoMgmModule} from './logo-mgm/logo-mgm.module';
import {HermeneutAttackCostParamMgmModule} from './attack-cost-param-mgm/attack-cost-param-mgm.module';
import {ThreatAgentInterestModule} from "./threat-agent-interest/threat-agent-interest.module";

import { HermeneutDataImpactDescriptionMgmModule } from './data-impact-description-mgm/data-impact-description-mgm.module';
import { HermeneutDataRecipientMgmModule } from './data-recipient-mgm/data-recipient-mgm.module';
import { HermeneutSecurityImpactMgmModule } from './security-impact-mgm/security-impact-mgm.module';
import { HermeneutOverallSecurityImpactMgmModule } from './overall-security-impact-mgm/overall-security-impact-mgm.module';
import { HermeneutDataOperationMgmModule } from './data-operation-mgm/data-operation-mgm.module';
import { HermeneutDataThreatMgmModule } from './data-threat-mgm/data-threat-mgm.module';
import { HermeneutOverallDataThreatMgmModule } from './overall-data-threat-mgm/overall-data-threat-mgm.module';
import { HermeneutGDPRQuestionnaireMgmModule } from './gdpr-questionnaire-mgm/gdpr-questionnaire-mgm.module';
import { HermeneutGDPRQuestionnaireStatusMgmModule } from './gdpr-questionnaire-status-mgm/gdpr-questionnaire-status-mgm.module';
import { HermeneutGDPRQuestionMgmModule } from './gdpr-question-mgm/gdpr-question-mgm.module';
import { HermeneutGDPRAnswerMgmModule } from './gdpr-answer-mgm/gdpr-answer-mgm.module';
import { HermeneutGDPRMyAnswerMgmModule } from './gdpr-my-answer-mgm/gdpr-my-answer-mgm.module';
import { HermeneutTranslationMgmModule } from './translation-mgm/translation-mgm.module';
import { HermeneutOverallDataRiskMgmModule } from './overall-data-risk-mgm/overall-data-risk-mgm.module';
import { HermeneutDataRiskLevelConfigMgmModule } from './data-risk-level-config-mgm/data-risk-level-config-mgm.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        HermeneutCompanyProfileMgmModule,
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
        HermeneutMyAnswerMgmModule,
        HermeneutAnswerWeightMgmModule,
        HermeneutQuestionnaireStatusMgmModule,
        HermeneutLevelMgmModule,
        HermeneutPhaseMgmModule,
        HermeneutCompanyGroupMgmModule,
        HermeneutMyAssetMgmModule,
        HermeneutDirectAssetMgmModule,
        HermeneutIndirectAssetMgmModule,
        HermeneutAttackCostMgmModule,
        HermeneutEconomicCoefficientsMgmModule,
        HermeneutEBITMgmModule,
        HermeneutEconomicResultsMgmModule,
        HermeneutSplittingLossMgmModule,
        HermeneutCriticalLevelMgmModule,
        HermeneutLikelihoodScaleMgmModule,
        HermeneutVulnerabilityScaleMgmModule,
        HermeneutMyCompanyMgmModule,
        HermeneutImpactLevelMgmModule,
        HermeneutImpactLevelDescriptionMgmModule,
        HermeneutSplittingValueMgmModule,
        HermeneutLogoMgmModule,
        HermeneutAttackCostParamMgmModule,
        ThreatAgentInterestModule,
        HermeneutDataImpactDescriptionMgmModule,
        HermeneutDataRecipientMgmModule,
        HermeneutSecurityImpactMgmModule,
        HermeneutOverallSecurityImpactMgmModule,
        HermeneutDataOperationMgmModule,
        HermeneutDataThreatMgmModule,
        HermeneutOverallDataThreatMgmModule,
        HermeneutGDPRQuestionnaireMgmModule,
        HermeneutGDPRQuestionnaireStatusMgmModule,
        HermeneutGDPRQuestionMgmModule,
        HermeneutGDPRAnswerMgmModule,
        HermeneutGDPRMyAnswerMgmModule,
        HermeneutTranslationMgmModule,
        HermeneutOverallDataRiskMgmModule,
        HermeneutDataRiskLevelConfigMgmModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutEntityModule {
}
