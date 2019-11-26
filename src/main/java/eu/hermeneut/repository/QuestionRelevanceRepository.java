package eu.hermeneut.repository;

import eu.hermeneut.domain.QuestionRelevance;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;


/**
 * Spring Data JPA repository for the QuestionRelevance entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QuestionRelevanceRepository extends JpaRepository<QuestionRelevance, Long> {

    @Query("SELECT questionRelevance from QuestionRelevance questionRelevance WHERE questionRelevance.status.id = :questionnaireStatusID")
    List<QuestionRelevance> findAllByQuestionnaireStatus(@Param("questionnaireStatusID") Long id);
}
