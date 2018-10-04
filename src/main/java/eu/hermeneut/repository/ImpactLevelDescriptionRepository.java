package eu.hermeneut.repository;

import eu.hermeneut.domain.ImpactLevelDescription;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the ImpactLevelDescription entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ImpactLevelDescriptionRepository extends JpaRepository<ImpactLevelDescription, Long> {

}
