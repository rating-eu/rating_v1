package eu.hermeneut.security.guardian;

import eu.hermeneut.domain.*;
import eu.hermeneut.security.AuthoritiesConstants;
import eu.hermeneut.security.SecurityUtils;
import eu.hermeneut.service.MyCompanyService;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("selfAssessmentGuardian")
public class SelfAssessmentGuardian implements Guardian<SelfAssessment> {

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private MyCompanyService myCompanyService;

    @Autowired
    private UserService userService;

    @Override
    public boolean isCISO(Long id) {
        if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.CISO)) {
            return false;
        }

        User user = this.userService.getUserWithAuthorities().orElseGet(null);

        if (user == null) {
            return false;
        }

        MyCompany myCompany = this.myCompanyService.findOneByUser(user.getId());

        if (myCompany == null) {
            return false;
        }

        CompanyProfile companyProfile = myCompany.getCompanyProfile();

        if (companyProfile == null) {
            return false;
        }

        List<SelfAssessment> selfAssessments = this.selfAssessmentService.findAllByCompanyProfile(companyProfile.getId());

        if (selfAssessments == null || selfAssessments.isEmpty()) {
            return false;
        }

        for (SelfAssessment selfAssessment : selfAssessments) {
            if (selfAssessment.getId().equals(id)) {
                return true;
            }
        }

        return false;
    }

    @Override
    public boolean isCISO(SelfAssessment selfAssessment) {
        if (selfAssessment == null) {
            return false;
        }

        return this.isCISO(selfAssessment.getId());
    }

    @Override
    public boolean isExternal(Long id) {
        if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.EXTERNAL_AUDIT)) {
            return false;
        }

        User user = this.userService.getUserWithAuthorities().orElseGet(null);

        if (user == null) {
            return false;
        }

        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(id);

        if (selfAssessment == null) {
            return false;
        }

        ExternalAudit externalAudit = selfAssessment.getExternalAudit();

        if (externalAudit == null) {
            return false;
        }

        if (externalAudit.getUser().getId().equals(user.getId())) {
            return true;
        }

        return false;
    }

    @Override
    public boolean isExternal(SelfAssessment selfAssessment) {
        if (selfAssessment == null) {
            return false;
        }

        return this.isExternal(selfAssessment.getId());
    }
}
