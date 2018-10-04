package eu.hermeneut.repository;

import eu.hermeneut.domain.ImpactLevel;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;


/**
 * Spring Data JPA repository for the ImpactLevel entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ImpactLevelRepository extends JpaRepository<ImpactLevel, Long> {

    @Query("SELECT impactLevel FROM ImpactLevel impactLevel WHERE impactLevel.selfAssessmentID = :selfAssessmentID")
    List<ImpactLevel> findAllBySelfAssessment(@Param("selfAssessmentID") Long selfAssessmentID);
}
