package eu.hermeneut.repository;

import eu.hermeneut.domain.DomainOfInfluence;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the DomainOfInfluence entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DomainOfInfluenceRepository extends JpaRepository<DomainOfInfluence, Long> {

}
