package eu.hermeneut.repository;

import eu.hermeneut.domain.EconomicCoefficients;
import eu.hermeneut.domain.EconomicResults;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the EconomicCoefficients entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EconomicCoefficientsRepository extends JpaRepository<EconomicCoefficients, Long> {

    @Query("SELECT economicCoefficients FROM EconomicCoefficients economicCoefficients WHERE economicCoefficients.selfAssessment.id = :selfAssessmentID")
    EconomicCoefficients findOneBySelfAssessmentID(@Param("selfAssessmentID") Long selfAssessmentID);
}
