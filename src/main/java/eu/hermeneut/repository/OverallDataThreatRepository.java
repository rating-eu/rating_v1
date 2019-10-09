package eu.hermeneut.repository;

import eu.hermeneut.domain.OverallDataThreat;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the OverallDataThreat entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OverallDataThreatRepository extends JpaRepository<OverallDataThreat, Long> {

    @Query("SELECT DISTINCT overall FROM OverallDataThreat overall LEFT JOIN FETCH overall.threats WHERE overall.operation.id = :operationID")
    OverallDataThreat findOneByDataOperation(@Param("operationID") Long operationID);
}
