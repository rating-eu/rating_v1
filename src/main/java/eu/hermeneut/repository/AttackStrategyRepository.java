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

    @Query("SELECT DISTINCT attack_strategy FROM AttackStrategy attack_strategy LEFT JOIN FETCH attack_strategy.mitigations INNER JOIN FETCH attack_strategy.levels levels  WHERE levels.id = :levelID")
    List<AttackStrategy> findAllByLevel(@Param("levelID") Long levelID);


    @Query("SELECT DISTINCT attack_strategy FROM AttackStrategy attack_strategy LEFT JOIN FETCH attack_strategy.mitigations INNER JOIN FETCH attack_strategy.phases phases  WHERE phases.id = :phaseID")
    List<AttackStrategy> findAllByPhase(@Param("phaseID") Long phaseID);


    @Query("SELECT DISTINCT attack_strategy FROM AttackStrategy attack_strategy LEFT JOIN FETCH attack_strategy.mitigations INNER JOIN FETCH attack_strategy.levels levels INNER JOIN FETCH attack_strategy.phases phases WHERE levels.id = :levelID AND phases.id = :phaseID")
    List<AttackStrategy> findAllByLevelAndPhase(@Param("levelID") Long levelID, @Param("phaseID") Long phaseID);
}
