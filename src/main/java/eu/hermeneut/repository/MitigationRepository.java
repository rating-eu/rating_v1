package eu.hermeneut.repository;

import eu.hermeneut.domain.Mitigation;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Mitigation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MitigationRepository extends JpaRepository<Mitigation, Long> {

}
