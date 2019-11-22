package eu.hermeneut.repository;

import eu.hermeneut.domain.QuestionRelevance;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the QuestionRelevance entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QuestionRelevanceRepository extends JpaRepository<QuestionRelevance, Long> {

}
