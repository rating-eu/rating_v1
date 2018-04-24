package eu.hermeneut.repository;

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
    @Query("select distinct self_assessment from SelfAssessment self_assessment left join fetch self_assessment.companyprofiles left join fetch self_assessment.departments left join fetch self_assessment.assets left join fetch self_assessment.threatagents left join fetch self_assessment.attackstrategies left join fetch self_assessment.externalaudits left join fetch self_assessment.questionnaires")
    List<SelfAssessment> findAllWithEagerRelationships();

    @Query("select self_assessment from SelfAssessment self_assessment left join fetch self_assessment.companyprofiles left join fetch self_assessment.departments left join fetch self_assessment.assets left join fetch self_assessment.threatagents left join fetch self_assessment.attackstrategies left join fetch self_assessment.externalaudits left join fetch self_assessment.questionnaires where self_assessment.id =:id")
    SelfAssessment findOneWithEagerRelationships(@Param("id") Long id);

}
