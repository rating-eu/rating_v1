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
