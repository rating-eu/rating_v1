package eu.hermeneut.repository;

import eu.hermeneut.domain.PhaseWrapper;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the PhaseWrapper entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PhaseWrapperRepository extends JpaRepository<PhaseWrapper, Long> {

}
