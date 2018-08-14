package eu.hermeneut.repository;

import eu.hermeneut.domain.SplittingLoss;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;


/**
 * Spring Data JPA repository for the SplittingLoss entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SplittingLossRepository extends JpaRepository<SplittingLoss, Long> {

    @Query("SELECT splittingLoss FROM SplittingLoss splittingLoss WHERE splittingLoss.selfAssessment.id = :selfAssessmentID")
    List<SplittingLoss> findAllBySelfAssessmentID(@Param("selfAssessmentID") Long selfAssessmentID);
}
