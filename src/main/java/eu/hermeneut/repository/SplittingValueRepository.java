package eu.hermeneut.repository;

import eu.hermeneut.domain.SplittingLoss;
import eu.hermeneut.domain.SplittingValue;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;


/**
 * Spring Data JPA repository for the SplittingValue entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SplittingValueRepository extends JpaRepository<SplittingValue, Long> {

    @Query("SELECT splittingValue FROM SplittingValue splittingValue WHERE splittingValue.selfAssessment.id = :selfAssessmentID")
    List<SplittingValue> findAllBySelfAssessmentID(@Param("selfAssessmentID") Long selfAssessmentID);
}
