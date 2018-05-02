package eu.hermeneut.repository;

import eu.hermeneut.domain.AttackStrategy;
import eu.hermeneut.domain.enumeration.Level;
import eu.hermeneut.domain.enumeration.Phase;
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
    @Query("SELECT DISTINCT attack_strategy FROM AttackStrategy attack_strategy LEFT JOIN FETCH attack_strategy.mitigations LEFT JOIN FETCH attack_strategy.threatAgents")
    List<AttackStrategy> findAllWithEagerRelationships();

    @Query("select attack_strategy FROM AttackStrategy attack_strategy LEFT JOIN FETCH attack_strategy.mitigations LEFT JOIN FETCH attack_strategy.threatAgents WHERE attack_strategy.id =:id")
    AttackStrategy findOneWithEagerRelationships(@Param("id") Long id);

    @Query("SELECT DISTINCT attack_strategy FROM AttackStrategy attack_strategy INNER JOIN FETCH attack_strategy.levels levels LEFT JOIN FETCH attack_strategy.mitigations LEFT JOIN FETCH attack_strategy.threatAgents WHERE levels.level = :level")
    List<AttackStrategy> findAllByLevel(@Param("level") Level level);


    @Query("SELECT DISTINCT attack_strategy FROM AttackStrategy attack_strategy INNER JOIN FETCH attack_strategy.phases phases LEFT JOIN FETCH attack_strategy.mitigations LEFT JOIN FETCH attack_strategy.threatAgents WHERE phases.phase = :phase")
    List<AttackStrategy> findAllByPhase(@Param("phase") Phase phase);


    @Query("SELECT DISTINCT attack_strategy FROM AttackStrategy attack_strategy INNER JOIN FETCH attack_strategy.levels levels INNER JOIN FETCH attack_strategy.phases phases LEFT JOIN FETCH attack_strategy.mitigations LEFT JOIN FETCH attack_strategy.threatAgents WHERE levels.level = :level AND phases.phase = :phase")
    List<AttackStrategy> findAllByLevelAndPhase(@Param("level") Level level, @Param("phase") Phase phase);
}
