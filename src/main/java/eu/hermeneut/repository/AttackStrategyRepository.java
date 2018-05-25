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
    @Query("SELECT DISTINCT attack_strategy FROM AttackStrategy attack_strategy LEFT JOIN FETCH attack_strategy.mitigations LEFT JOIN FETCH attack_strategy.levels LEFT JOIN FETCH attack_strategy.phases")
    List<AttackStrategy> findAllWithEagerRelationships();

    @Query("SELECT attack_strategy FROM AttackStrategy attack_strategy LEFT JOIN FETCH attack_strategy.mitigations LEFT JOIN FETCH attack_strategy.levels LEFT JOIN FETCH attack_strategy.phases where attack_strategy.id =:id")
    AttackStrategy findOneWithEagerRelationships(@Param("id") Long id);

    @Query("SELECT DISTINCT attack_strategy FROM AttackStrategy attack_strategy LEFT JOIN FETCH attack_strategy.mitigations INNER JOIN FETCH attack_strategy.levels levels  WHERE :level MEMBER OF levels")
    List<AttackStrategy> findAllByLevel(@Param("level") Level level);


    @Query("SELECT DISTINCT attack_strategy FROM AttackStrategy attack_strategy LEFT JOIN FETCH attack_strategy.mitigations INNER JOIN FETCH attack_strategy.phases phases  WHERE :phase MEMBER OF phases")
    List<AttackStrategy> findAllByPhase(@Param("phase") Phase phase);


    @Query("SELECT DISTINCT attack_strategy FROM AttackStrategy attack_strategy LEFT JOIN FETCH attack_strategy.mitigations INNER JOIN FETCH attack_strategy.levels levels INNER JOIN FETCH attack_strategy.phases phases WHERE :level MEMBER OF levels AND :phase MEMBER OF phases")
    List<AttackStrategy> findAllByLevelAndPhase(@Param("level") Level level, @Param("phase") Phase phase);
}
