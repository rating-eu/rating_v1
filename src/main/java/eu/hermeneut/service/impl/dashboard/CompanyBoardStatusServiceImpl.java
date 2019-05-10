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

package eu.hermeneut.service.impl.dashboard;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.enumeration.QuestionnairePurpose;
import eu.hermeneut.domain.enumeration.Role;
import eu.hermeneut.domain.enumeration.Status;
import eu.hermeneut.service.*;
import eu.hermeneut.service.dashboard.CompanyBoardStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CompanyBoardStatusServiceImpl implements CompanyBoardStatusService {
    @Autowired
    private QuestionnaireStatusService questionnaireStatusService;

    @Autowired
    private CompanyProfileService companyProfileService;

    @Override
    public Status getIdentifyThreatAgentsStatus(Long companyProfileID) {
        Status status = Status.EMPTY;
        CompanyProfile companyProfile = this.companyProfileService.findOne(companyProfileID);

        if (companyProfile != null) {
            QuestionnaireStatus questionnaireStatus = this.questionnaireStatusService.findAllByCompanyProfileAndQuestionnairePurpose(companyProfileID, QuestionnairePurpose.ID_THREAT_AGENT).stream().findFirst().orElse(null);

            status = questionnaireStatus != null ? questionnaireStatus.getStatus() : Status.EMPTY;
        }

        return status;
    }

    @Override
    public Status getAssessVulnerabilitiesStatus(Long companyProfileID) {
        Status status = Status.EMPTY;
        CompanyProfile companyProfile = this.companyProfileService.findOne(companyProfileID);

        if (companyProfile != null) {
            QuestionnaireStatus questionnaireStatus = this.questionnaireStatusService.findByCompanyProfileRoleAndQuestionnairePurpose(companyProfileID, Role.ROLE_CISO, QuestionnairePurpose.SELFASSESSMENT);

            status = questionnaireStatus != null ? questionnaireStatus.getStatus() : Status.EMPTY;
        }

        return status;
    }

    @Override
    public Status getRefineVulnerabilitiesStatus(Long companyProfileID) {
        Status status = Status.EMPTY;
        CompanyProfile companyProfile = this.companyProfileService.findOne(companyProfileID);

        if (companyProfile != null) {
            QuestionnaireStatus questionnaireStatus = this.questionnaireStatusService.findByCompanyProfileRoleAndQuestionnairePurpose(companyProfileID, Role.ROLE_EXTERNAL_AUDIT, QuestionnairePurpose.SELFASSESSMENT);

            status = questionnaireStatus != null ? questionnaireStatus.getStatus() : Status.EMPTY;
        }

        return status;
    }
}
