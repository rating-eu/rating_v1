package eu.hermeneut.repository;

import eu.hermeneut.domain.SecurityImpact;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the SecurityImpact entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SecurityImpactRepository extends JpaRepository<SecurityImpact, Long> {

}
