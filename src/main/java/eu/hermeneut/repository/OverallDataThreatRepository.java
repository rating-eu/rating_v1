package eu.hermeneut.repository;

import eu.hermeneut.domain.OverallDataThreat;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the OverallDataThreat entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OverallDataThreatRepository extends JpaRepository<OverallDataThreat, Long> {

}
