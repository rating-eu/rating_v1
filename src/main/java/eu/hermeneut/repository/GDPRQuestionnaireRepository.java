package eu.hermeneut.repository;

import eu.hermeneut.domain.GDPRQuestionnaire;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the GDPRQuestionnaire entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GDPRQuestionnaireRepository extends JpaRepository<GDPRQuestionnaire, Long> {

}
