package eu.hermeneut.repository;

import eu.hermeneut.domain.OverallDataRisk;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the OverallDataRisk entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OverallDataRiskRepository extends JpaRepository<OverallDataRisk, Long> {

}
