package eu.hermeneut.repository;

import eu.hermeneut.domain.GDPRMyAnswer;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the GDPRMyAnswer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GDPRMyAnswerRepository extends JpaRepository<GDPRMyAnswer, Long> {

}
