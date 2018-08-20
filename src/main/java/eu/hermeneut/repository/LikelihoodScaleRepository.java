package eu.hermeneut.repository;

import eu.hermeneut.domain.LikelihoodScale;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;


/**
 * Spring Data JPA repository for the LikelihoodScale entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LikelihoodScaleRepository extends JpaRepository<LikelihoodScale, Long> {

    @Query("SELECT LikelihoodScale from LikelihoodScale likelihoodScale WHERE likelihoodScale.selfAssessment.id = :selfAssessmentID")
    List<LikelihoodScale> findAllBySelfAssessment(@Param("selfAssessmentID") Long selfAssessmentID);
}
