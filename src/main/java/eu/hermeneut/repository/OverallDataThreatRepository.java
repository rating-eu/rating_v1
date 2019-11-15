package eu.hermeneut.repository;

import eu.hermeneut.domain.OverallDataThreat;
import eu.hermeneut.domain.OverallSecurityImpact;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;


/**
 * Spring Data JPA repository for the OverallDataThreat entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OverallDataThreatRepository extends JpaRepository<OverallDataThreat, Long> {

    @Query("SELECT DISTINCT threat FROM OverallDataThreat threat LEFT JOIN FETCH threat.threats WHERE threat.operation.id = :operationID")
    OverallDataThreat findOneByDataOperation(@Param("operationID") Long operationID);

    @Query("SELECT threat FROM OverallDataThreat threat WHERE threat.operation.companyProfile.id = :companyID")
    List<OverallDataThreat> findAllByCompanyProfile(@Param("companyID") Long companyID);
}
