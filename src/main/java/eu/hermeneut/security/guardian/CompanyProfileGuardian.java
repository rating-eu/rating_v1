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
import eu.hermeneut.domain.MyCompany;
import eu.hermeneut.domain.User;
import eu.hermeneut.security.AuthoritiesConstants;
import eu.hermeneut.security.SecurityUtils;
import eu.hermeneut.service.CompanyProfileService;
import eu.hermeneut.service.MyCompanyService;
import eu.hermeneut.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("companyProfileGuardian")
public class CompanyProfileGuardian implements Guardian<CompanyProfile> {

    @Autowired
    private CompanyProfileService companyProfileService;

    @Autowired
    private MyCompanyService myCompanyService;

    @Autowired
    private UserService userService;

    @Override
    public boolean isCISO(Long id) {
        if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.CISO)) {
            return false;
        }

        CompanyProfile companyProfile = this.companyProfileService.findOne(id);

        return checkCompany(companyProfile);
    }

    @Override
    public boolean isCISO(CompanyProfile companyProfile) {
        if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.CISO)) {
            return false;
        }

        return checkCompany(companyProfile);
    }

    @Override
    public boolean isExternal(Long id) {
        if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.EXTERNAL_AUDIT)) {
            return false;
        }

        CompanyProfile companyProfile = this.companyProfileService.findOne(id);

        return checkCompany(companyProfile);
    }

    @Override
    public boolean isExternal(CompanyProfile companyProfile) {
        if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.EXTERNAL_AUDIT)) {
            return false;
        }

        return checkCompany(companyProfile);
    }

    private boolean checkCompany(CompanyProfile companyProfile) {
        if (companyProfile == null) {
            return false;
        }

        User user = this.userService.getUserWithAuthorities().orElse(null);

        if (user == null) {
            return false;
        }

        MyCompany myCompany = this.myCompanyService.findOneByUser(user.getId());

        if (myCompany == null) {
            return false;
        }

        if (myCompany.getCompanyProfile().equals(companyProfile)) {
            return true;
        }

        return false;
    }
}
