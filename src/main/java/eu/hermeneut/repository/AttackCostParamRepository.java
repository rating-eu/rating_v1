package eu.hermeneut.repository;

import eu.hermeneut.domain.AttackCostParam;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the AttackCostParam entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AttackCostParamRepository extends JpaRepository<AttackCostParam, Long> {

}
