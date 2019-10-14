package eu.hermeneut.repository;

import eu.hermeneut.domain.GDPRAnswer;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the GDPRAnswer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GDPRAnswerRepository extends JpaRepository<GDPRAnswer, Long> {

}
