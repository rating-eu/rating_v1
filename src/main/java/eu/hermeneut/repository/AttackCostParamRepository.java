package eu.hermeneut.repository;

import eu.hermeneut.domain.AttackCostParam;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;


/**
 * Spring Data JPA repository for the AttackCostParam entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AttackCostParamRepository extends JpaRepository<AttackCostParam, Long> {

    @Query(
        "SELECT DISTINCT cost_param " +
            "FROM AttackCostParam cost_param LEFT JOIN FETCH cost_param.selfAssessment " +
            "WHERE cost_param.selfAssessment.id = :selfAssessmentID"
    )
    List<AttackCostParam> findAllBySelfAssessment(@Param("selfAssessmentID") Long selfAssessmentID);
}
