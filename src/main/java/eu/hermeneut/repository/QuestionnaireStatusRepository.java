package eu.hermeneut.repository;

import eu.hermeneut.domain.QuestionnaireStatus;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the QuestionnaireStatus entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QuestionnaireStatusRepository extends JpaRepository<QuestionnaireStatus, Long> {

}
