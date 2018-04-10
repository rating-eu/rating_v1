package eu.hermeneut.repository;

import eu.hermeneut.domain.Motivation;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Motivation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MotivationRepository extends JpaRepository<Motivation, Long> {

}
