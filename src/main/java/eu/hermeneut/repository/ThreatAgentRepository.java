package eu.hermeneut.repository;

import eu.hermeneut.domain.ThreatAgent;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * Spring Data JPA repository for the ThreatAgent entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ThreatAgentRepository extends JpaRepository<ThreatAgent, Long> {
    @Query("select distinct threat_agent from ThreatAgent threat_agent left join fetch threat_agent.motivations")
    List<ThreatAgent> findAllWithEagerRelationships();

    @Query("select threat_agent from ThreatAgent threat_agent left join fetch threat_agent.motivations where threat_agent.id =:id")
    ThreatAgent findOneWithEagerRelationships(@Param("id") Long id);

}
