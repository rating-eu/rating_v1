package eu.hermeneut.repository;

import eu.hermeneut.domain.OverallSecurityImpact;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the OverallSecurityImpact entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OverallSecurityImpactRepository extends JpaRepository<OverallSecurityImpact, Long> {

}
