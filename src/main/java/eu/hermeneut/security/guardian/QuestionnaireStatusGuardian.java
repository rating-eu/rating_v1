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

package eu.hermeneut.security.guardian;

import eu.hermeneut.domain.CompanyProfile;
import eu.hermeneut.domain.QuestionnaireStatus;
import eu.hermeneut.domain.enumeration.Role;
import eu.hermeneut.security.AuthoritiesConstants;
import eu.hermeneut.security.SecurityUtils;
import eu.hermeneut.service.QuestionnaireStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("questionnaireStatusGuardian")
public class QuestionnaireStatusGuardian implements Guardian<QuestionnaireStatus> {

    @Autowired
    private CompanyProfileGuardian companyProfileGuardian;

    @Autowired
    private QuestionnaireStatusService questionnaireStatusService;

    @Override
    public boolean isCISO(Long id) {
        if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.CISO)) {
            return false;
        }

        QuestionnaireStatus questionnaireStatus = this.questionnaireStatusService.findOne(id);

        if (questionnaireStatus == null) {
            return false;
        }

        if (!questionnaireStatus.getRole().equals(Role.ROLE_CISO)) {
            return false;
        }

        CompanyProfile companyProfile = questionnaireStatus.getCompanyProfile();

        return this.companyProfileGuardian.isCISO(companyProfile);
    }

    @Override
    public boolean isCISO(QuestionnaireStatus questionnaireStatus) {
        if (questionnaireStatus == null || !questionnaireStatus.getRole().equals(Role.ROLE_CISO)) {
            return false;
        }

        if (questionnaireStatus.getId() == null) {
            CompanyProfile companyProfile = questionnaireStatus.getCompanyProfile();

            return this.companyProfileGuardian.isCISO(companyProfile);
        } else {
            return this.isCISO(questionnaireStatus.getId());
        }
    }

    @Override
    public boolean isExternal(Long id) {
        if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.EXTERNAL_AUDIT)) {
            return false;
        }

        QuestionnaireStatus questionnaireStatus = this.questionnaireStatusService.findOne(id);

        if (questionnaireStatus == null) {
            return false;
        }

        if (!questionnaireStatus.getRole().equals(Role.ROLE_EXTERNAL_AUDIT)) {
            return false;
        }

        CompanyProfile companyProfile = questionnaireStatus.getCompanyProfile();

        return this.companyProfileGuardian.isExternal(companyProfile);
    }

    @Override
    public boolean isExternal(QuestionnaireStatus questionnaireStatus) {
        if (questionnaireStatus == null || !questionnaireStatus.getRole().equals(Role.ROLE_EXTERNAL_AUDIT)) {
            return false;
        }

        if (questionnaireStatus.getId() == null) {
            CompanyProfile companyProfile = questionnaireStatus.getCompanyProfile();

            return this.companyProfileGuardian.isExternal(companyProfile);
        } else {
            return this.isExternal(questionnaireStatus.getId());
        }
    }
}
