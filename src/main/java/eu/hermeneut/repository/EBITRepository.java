package eu.hermeneut.repository;

import eu.hermeneut.domain.EBIT;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;


/**
 * Spring Data JPA repository for the EBIT entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EBITRepository extends JpaRepository<EBIT, Long> {

    @Query("SELECT ebit FROM EBIT ebit WHERE ebit.selfAssessment.id = :selfAssessmentID")
    List<EBIT> findAllBySelfAssessment(@Param("selfAssessmentID") Long selfAssessmentID);
}
