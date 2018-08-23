package eu.hermeneut.repository;

import eu.hermeneut.domain.AttackCost;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the AttackCost entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AttackCostRepository extends JpaRepository<AttackCost, Long> {

}
