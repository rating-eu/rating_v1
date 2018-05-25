package eu.hermeneut.repository;

import eu.hermeneut.domain.AttackStrategy;
import eu.hermeneut.domain.Level;
import eu.hermeneut.domain.Phase;
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
    @Query("select distinct attack_strategy from AttackStrategy attack_strategy left join fetch attack_strategy.mitigations")
    List<AttackStrategy> findAllWithEagerRelationships();

    @Query("select attack_strategy from AttackStrategy attack_strategy left join fetch attack_strategy.mitigations where attack_strategy.id =:id")
    AttackStrategy findOneWithEagerRelationships(@Param("id") Long id);

    @Query("SELECT DISTINCT attack_strategy FROM AttackStrategy attack_strategy INNER JOIN FETCH attack_strategy.levels levels LEFT JOIN FETCH attack_strategy.mitigations WHERE levels.level = :level")
    List<AttackStrategy> findAllByLevel(@Param("level") Level level);


    @Query("SELECT DISTINCT attack_strategy FROM AttackStrategy attack_strategy INNER JOIN FETCH attack_strategy.phases phases LEFT JOIN FETCH attack_strategy.mitigations WHERE phases.phase = :phase")
    List<AttackStrategy> findAllByPhase(@Param("phase") Phase phase);


    @Query("SELECT DISTINCT attack_strategy FROM AttackStrategy attack_strategy INNER JOIN FETCH attack_strategy.levels levels INNER JOIN FETCH attack_strategy.phases phases LEFT JOIN FETCH attack_strategy.mitigations WHERE levels.level = :level AND phases.phase = :phase")
    List<AttackStrategy> findAllByLevelAndPhase(@Param("level") Level level, @Param("phase") Phase phase);
}
