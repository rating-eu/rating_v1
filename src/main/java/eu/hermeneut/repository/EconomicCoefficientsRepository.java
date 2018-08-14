package eu.hermeneut.repository;

import eu.hermeneut.domain.EconomicCoefficients;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the EconomicCoefficients entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EconomicCoefficientsRepository extends JpaRepository<EconomicCoefficients, Long> {

}
