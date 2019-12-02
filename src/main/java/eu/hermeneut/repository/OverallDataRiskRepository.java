package eu.hermeneut.repository;

import eu.hermeneut.domain.OverallDataRisk;
import eu.hermeneut.domain.OverallSecurityImpact;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;


/**
 * Spring Data JPA repository for the OverallDataRisk entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OverallDataRiskRepository extends JpaRepository<OverallDataRisk, Long> {

    @Query("SELECT risk FROM OverallDataRisk risk WHERE risk.operation.id = :operationID")
    OverallDataRisk findOneByDataOperation(@Param("operationID") Long operationID);

    @Query("SELECT risk FROM OverallDataRisk risk WHERE risk.operation.companyProfile.id = :companyID")
    List<OverallDataRisk> findAllByCompanyProfile(@Param("companyID") Long companyID);
}
