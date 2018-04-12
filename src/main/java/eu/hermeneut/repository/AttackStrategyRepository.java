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
    @Query("select distinct attack_strategy from AttackStrategy attack_strategy left join fetch attack_strategy.mitigations left join fetch attack_strategy.threatAgents")
    List<AttackStrategy> findAllWithEagerRelationships();

    @Query("select attack_strategy from AttackStrategy attack_strategy left join fetch attack_strategy.mitigations left join fetch attack_strategy.threatAgents where attack_strategy.id =:id")
    AttackStrategy findOneWithEagerRelationships(@Param("id") Long id);
    
    
    
    @Query("select distinct attack_strategy from AttackStrategy attack_strategy left join fetch attack_strategy.mitigations left join fetch attack_strategy.threatAgents WHERE attack_strategy.level = :level")
    List<AttackStrategy> findAllByLevel(@Param("level") Level level);
    
    
    @Query("select distinct attack_strategy from AttackStrategy attack_strategy left join fetch attack_strategy.mitigations left join fetch attack_strategy.threatAgents WHERE attack_strategy.phase = :phase")
    List<AttackStrategy> findAllByPhase(@Param("phase") Phase phase);
    
    
    @Query("select distinct attack_strategy from AttackStrategy attack_strategy left join fetch attack_strategy.mitigations left join fetch attack_strategy.threatAgents WHERE attack_strategy.phase = :phase AND attack_strategy.level = :level")
    List<AttackStrategy> findAllByLevelAndPhase(@Param("level") Level level, @Param("phase") Phase phase);
}
