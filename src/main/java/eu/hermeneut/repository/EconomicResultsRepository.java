package eu.hermeneut.repository;

import eu.hermeneut.domain.EconomicResults;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the EconomicResults entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EconomicResultsRepository extends JpaRepository<EconomicResults, Long> {

}
