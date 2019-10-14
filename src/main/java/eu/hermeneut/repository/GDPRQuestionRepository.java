package eu.hermeneut.repository;

import eu.hermeneut.domain.GDPRQuestion;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the GDPRQuestion entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GDPRQuestionRepository extends JpaRepository<GDPRQuestion, Long> {
    @Query("SELECT DISTINCT gdpr_question FROM GDPRQuestion gdpr_question LEFT JOIN FETCH gdpr_question.answers")
    List<GDPRQuestion> findAllWithEagerRelationships();

    @Query("SELECT DISTINCT gdpr_question FROM GDPRQuestion gdpr_question LEFT JOIN FETCH gdpr_question.answers WHERE gdpr_question.id =:id")
    GDPRQuestion findOneWithEagerRelationships(@Param("id") Long id);

    @Query("SELECT DISTINCT question FROM GDPRQuestion question LEFT JOIN FETCH question.answers WHERE question.questionnaire.id = :questionnaireID")
    List<GDPRQuestion> findAllByQuestionnaire(@Param("questionnaireID") Long questionnaireID);
}
