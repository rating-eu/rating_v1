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

import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.security.AuthoritiesConstants;
import eu.hermeneut.security.SecurityUtils;
import eu.hermeneut.service.MyAssetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("myAssetGuardian")
public class MyAssetGuardian implements Guardian<MyAsset> {

    @Autowired
    SelfAssessmentGuardian selfAssessmentGuardian;

    @Autowired
    MyAssetService myAssetService;

    @Override
    public boolean isCISO(Long id) {
        if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.CISO)) {
            return false;
        }

        MyAsset myAsset = this.myAssetService.findOne(id);

        if (myAsset == null) {
            return false;
        }

        SelfAssessment selfAssessment = myAsset.getSelfAssessment();

        return this.selfAssessmentGuardian.isCISO(selfAssessment);
    }

    @Override
    public boolean isCISO(MyAsset myAsset) {
        if (myAsset == null) {
            return false;
        }

        if (myAsset.getId() == null) {
            return this.selfAssessmentGuardian.isCISO(myAsset.getSelfAssessment());
        } else {
            return this.isCISO(myAsset.getId());
        }
    }

    @Override
    public boolean isExternal(Long id) {
        if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.EXTERNAL_AUDIT)) {
            return false;
        }

        MyAsset myAsset = this.myAssetService.findOne(id);

        if (myAsset == null) {
            return false;
        }

        SelfAssessment selfAssessment = myAsset.getSelfAssessment();
        return this.selfAssessmentGuardian.isExternal(selfAssessment);
    }

    @Override
    public boolean isExternal(MyAsset myAsset) {
        if (myAsset == null) {
            return false;
        }

        if (myAsset.getId() == null) {
            return this.selfAssessmentGuardian.isExternal(myAsset.getSelfAssessment());
        } else {
            return this.isExternal(myAsset.getId());
        }
    }
}
