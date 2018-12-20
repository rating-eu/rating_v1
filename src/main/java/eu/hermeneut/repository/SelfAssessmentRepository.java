package eu.hermeneut.repository;

import eu.hermeneut.domain.ExternalAudit;
import eu.hermeneut.domain.SelfAssessment;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the SelfAssessment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SelfAssessmentRepository extends JpaRepository<SelfAssessment, Long> {

    @Query("select self_assessment from SelfAssessment self_assessment where self_assessment.user.login = ?#{principal.username}")
    List<SelfAssessment> findByUserIsCurrentUser();

    @Query("select distinct self_assessment from SelfAssessment self_assessment left join fetch self_assessment.companyGroups left join fetch self_assessment.threatagents left join fetch self_assessment.questionnaires")
    List<SelfAssessment> findAllWithEagerRelationships();

    @Query("select DISTINCT self_assessment from SelfAssessment self_assessment left join fetch self_assessment.companyGroups left join fetch self_assessment.threatagents left join fetch self_assessment.questionnaires where self_assessment.id =:id")
    SelfAssessment findOneWithEagerRelationships(@Param("id") Long id);

    @Query("SELECT DISTINCT self_assessment FROM SelfAssessment self_assessment left join fetch self_assessment.companyGroups left join fetch self_assessment.threatagents left join fetch self_assessment.questionnaires WHERE self_assessment.companyProfile.id =:companyProfileID")
    List<SelfAssessment> findAllByCompanyProfile(@Param("companyProfileID") Long companyProfileID);

    @Query("SELECT DISTINCT self_assessment FROM SelfAssessment self_assessment left join fetch self_assessment.companyGroups left join fetch self_assessment.threatagents left join fetch self_assessment.questionnaires WHERE self_assessment.companyProfile.id =:companyProfileID")
    List<SelfAssessment> findAllByExternalAudit(ExternalAudit externalAudit);
}
