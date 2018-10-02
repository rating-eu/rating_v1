package eu.hermeneut.repository;

import eu.hermeneut.domain.ImpactLevel;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the ImpactLevel entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ImpactLevelRepository extends JpaRepository<ImpactLevel, Long> {

}
