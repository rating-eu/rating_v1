package eu.hermeneut.repository;

import eu.hermeneut.domain.OverallSecurityImpact;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;


/**
 * Spring Data JPA repository for the OverallSecurityImpact entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OverallSecurityImpactRepository extends JpaRepository<OverallSecurityImpact, Long> {

    @Query("SELECT impact FROM OverallSecurityImpact impact WHERE impact.operation.id = :dataOperationID")
    OverallSecurityImpact findOneByDataOperation(@Param("dataOperationID") Long dataOperationID);

    @Query("SELECT impact FROM OverallSecurityImpact impact WHERE impact.operation.companyProfile.id = :companyID")
    List<OverallSecurityImpact> findAllByCompanyProfile(@Param("companyID") Long companyID);
}
