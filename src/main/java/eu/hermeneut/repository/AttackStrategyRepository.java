package eu.hermeneut.repository;

import eu.hermeneut.domain.AttackStrategy;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * Spring Data JPA repository for the AttackStrategy entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AttackStrategyRepository extends JpaRepository<AttackStrategy, Long> {
    @Query("select distinct attack_strategy from AttackStrategy attack_strategy left join fetch attack_strategy.mitigations left join fetch attack_strategy.threatAgents")
    List<AttackStrategy> findAllWithEagerRelationships();

    @Query("select attack_strategy from AttackStrategy attack_strategy left join fetch attack_strategy.mitigations left join fetch attack_strategy.threatAgents where attack_strategy.id =:id")
    AttackStrategy findOneWithEagerRelationships(@Param("id") Long id);

}
