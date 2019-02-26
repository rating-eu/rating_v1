package eu.hermeneut.repository;

import eu.hermeneut.domain.GrowthRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GrowthRateRepository extends JpaRepository<GrowthRate, Long> {
    @Query("SELECT growth_rate " +
        "FROM GrowthRate growth_rate " +
        "LEFT JOIN FETCH growth_rate.selfAssessment self " +
        "WHERE self.id = :selfAssessmentID")
    List<GrowthRate> findAllBySelfAssessment(@Param("selfAssessmentID") Long selfAssessmentID);
}
