package eu.hermeneut.repository;

import eu.hermeneut.domain.CriticalLevel;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the CriticalLevel entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CriticalLevelRepository extends JpaRepository<CriticalLevel, Long> {

    @Query("select criticalLevel from CriticalLevel criticalLevel where criticalLevel.selfAssessment.id = :selfAssessmentID")
    CriticalLevel findOneBySelfAssessment(@Param("selfAssessmentID") Long selfAssessmentID);
}
