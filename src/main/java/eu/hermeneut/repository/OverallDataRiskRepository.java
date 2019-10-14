package eu.hermeneut.repository;

import eu.hermeneut.domain.OverallDataRisk;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the OverallDataRisk entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OverallDataRiskRepository extends JpaRepository<OverallDataRisk, Long> {

    @Query("SELECT overall FROM OverallDataRisk overall WHERE overall.operation.id = :operationID")
    OverallDataRisk findOneByDataOperation(@Param("operationID") Long operationID);
}
